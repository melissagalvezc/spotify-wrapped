from datetime import datetime
import os
from dotenv import load_dotenv

from spotify_client import get_spotify_client
from db import (
    init_db,
    insert_streams,
    upsert_tracks,
    upsert_artists,
    insert_top_tracks
)

load_dotenv()


def extract_recent_streams(sp):
    recent = sp.current_user_recently_played(limit=50).get("items", [])

    stream_rows = []
    track_ids = set()
    artist_ids = set()

    for item in recent:
        played_at = item["played_at"]
        played_at = datetime.fromisoformat(played_at.replace("Z", "+00:00"))

        track = item["track"]
        track_id = track["id"]

       
        context = (item.get("context") or {}).get("type")

        
        artists = track.get("artists", [])
        artist_id = artists[0]["id"] if artists else None

        
        stream_rows.append((played_at, track_id, artist_id, context))

        track_ids.add(track_id)
        for a in artists:
            artist_ids.add(a["id"])

    return stream_rows, list(track_ids), list(artist_ids)



def extract_tracks_metadata(sp, track_ids):
    rows = []
    for t_id in track_ids:
        track = sp.track(t_id)

        rows.append((
            track["id"],
            track["name"],
            track["album"]["name"],
            track["duration_ms"],
            [a["id"] for a in track["artists"]],
            track["popularity"]
        ))

    return rows



def extract_artists_metadata(sp, artist_ids):
    rows = []
    for a_id in artist_ids:
        artist = sp.artist(a_id)
        rows.append((
            artist["id"],
            artist["name"],
            artist.get("genres", []),
            artist.get("followers", {}).get("total", 0),
            artist.get("popularity", 0)
        ))
    return rows



def extract_top_tracks(sp, time_range):
    response = sp.current_user_top_tracks(time_range=time_range, limit=50).get("items", [])

    rows = []
    for idx, item in enumerate(response, start=1):

        track_id = item["id"]
        track_name = item["name"]

        artist = item["artists"][0] if item["artists"] else None
        artist_id = artist["id"] if artist else None
        artist_name = artist["name"] if artist else None

        popularity = item.get("popularity", None)

        rows.append((
            time_range,
            idx,
            track_id,
            track_name,
            artist_id,
            artist_name,
            popularity
        ))

    return rows



if __name__ == "__main__":
    init_db()

    sp = get_spotify_client()

    print("🔄 Extrayendo recently played...")
    stream_rows, track_ids, artist_ids = extract_recent_streams(sp)

    print(f"Inserting {len(stream_rows)} streams...")
    insert_streams(stream_rows)

    print("Extracting tracks...")
    if track_ids:
        track_rows = extract_tracks_metadata(sp, track_ids)
        upsert_tracks(track_rows)

    print("Extracting artists...")
    if artist_ids:
        artist_rows = extract_artists_metadata(sp, artist_ids)
        upsert_artists(artist_rows)

    print("Extracting Top Tracks para short, medium, long...")
    top_short = extract_top_tracks(sp, "short_term")
    top_medium = extract_top_tracks(sp, "medium_term")
    top_long = extract_top_tracks(sp, "long_term")

    all_top = top_short + top_medium + top_long
    print(f"Inserting {len(all_top)} top tracks...")
    insert_top_tracks(all_top)

    print("data inserted on Neon PostgreSQL.")
