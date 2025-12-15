{{ config(materialized='view') }}
WITH track_periods AS (
    SELECT
        track_id,
        track_name,
        artist_id,
        artist_name,
        COUNT(DISTINCT time_range) AS periods_appeared,
        SUM(rank) AS rank_score
    FROM {{ source('raw', 'top_tracks') }}
    GROUP BY track_id, track_name, artist_id, artist_name
    HAVING COUNT(DISTINCT time_range) = 3
)
SELECT
    track_id AS id,
    track_name AS name,
    track_name,
    artist_id,
    artist_name,
    NULL AS play_count
FROM track_periods
ORDER BY periods_appeared DESC, rank_score ASC
LIMIT 1
