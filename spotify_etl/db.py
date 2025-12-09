import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv

load_dotenv()

PG_CONN = os.getenv("PG_CONN")

def get_db_conn():
    return psycopg2.connect(PG_CONN)


# ---------------------------------------------------------
# create schema and tables if not exists
# ---------------------------------------------------------
def init_db():
    sql_commands = [
        """
        CREATE SCHEMA IF NOT EXISTS raw;
        """,
        """
        CREATE TABLE IF NOT EXISTS raw.streams (
            stream_id SERIAL PRIMARY KEY,
            played_at TIMESTAMPTZ NOT NULL,
            track_id TEXT NOT NULL,
            artist_id TEXT NOT NULL,
            context TEXT,
            ingested_at TIMESTAMPTZ DEFAULT NOW()
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS raw.tracks (
            track_id TEXT PRIMARY KEY,
            track_name TEXT,
            album_name TEXT,
            duration_ms INT,
            artist_ids TEXT[],
            popularity INT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS raw.artists (
            artist_id TEXT PRIMARY KEY,
            artist_name TEXT,
            genres TEXT[],
            followers BIGINT,
            popularity INT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS raw.top_tracks (
            id SERIAL PRIMARY KEY,
            time_range TEXT NOT NULL,  -- short_term, medium_term, long_term
            rank INT NOT NULL,
            track_id TEXT NOT NULL,
            track_name TEXT,
            artist_id TEXT,
            artist_name TEXT,
            popularity INT,
            inserted_at TIMESTAMPTZ DEFAULT NOW()
        );
        """
    ]

    conn = get_db_conn()
    cur = conn.cursor()

    for sql in sql_commands:
        cur.execute(sql)

    conn.commit()
    cur.close()
    conn.close()
    print("Tables created")


# ---------------------------------------------------------
# INSERT STREAMS
# ---------------------------------------------------------
def insert_streams(rows):
    sql = """
        INSERT INTO raw.streams (played_at, track_id, artist_id, context)
        VALUES %s
        ON CONFLICT DO NOTHING;
    """
    conn = get_db_conn()
    cur = conn.cursor()
    execute_values(cur, sql, rows)
    conn.commit()
    cur.close()
    conn.close()


# ---------------------------------------------------------
# UPSERT TRACKS
# ---------------------------------------------------------
def upsert_tracks(rows):
    sql = """
        INSERT INTO raw.tracks (track_id, track_name, album_name, duration_ms, artist_ids, popularity)
        VALUES %s
        ON CONFLICT (track_id) DO UPDATE SET
            track_name = EXCLUDED.track_name,
            album_name = EXCLUDED.album_name,
            duration_ms = EXCLUDED.duration_ms,
            artist_ids = EXCLUDED.artist_ids,
            popularity = EXCLUDED.popularity;
    """
    conn = get_db_conn()
    cur = conn.cursor()
    execute_values(cur, sql, rows)
    conn.commit()
    cur.close()
    conn.close()


# ---------------------------------------------------------
# UPSERT ARTISTS
# ---------------------------------------------------------
def upsert_artists(rows):
    sql = """
        INSERT INTO raw.artists (artist_id, artist_name, genres, followers, popularity)
        VALUES %s
        ON CONFLICT (artist_id) DO UPDATE SET
            artist_name = EXCLUDED.artist_name,
            genres = EXCLUDED.genres,
            followers = EXCLUDED.followers,
            popularity = EXCLUDED.popularity;
    """
    conn = get_db_conn()
    cur = conn.cursor()
    execute_values(cur, sql, rows)
    conn.commit()
    cur.close()
    conn.close()


# ---------------------------------------------------------
# INSERT TOP TRACKS FROM 3 TIME RANGES
# ---------------------------------------------------------
def insert_top_tracks(rows):
    sql = """
        INSERT INTO raw.top_tracks (
            time_range, rank, track_id, track_name, artist_id, artist_name, popularity
        )
        VALUES %s;
    """
    conn = get_db_conn()
    cur = conn.cursor()
    execute_values(cur, sql, rows)
    conn.commit()
    cur.close()
    conn.close()
