{{ config(materialized='view') }}
WITH artist_periods AS (
    SELECT
        artist_id,
        artist_name,
        COUNT(DISTINCT time_range) AS periods_appeared,
        SUM(rank) AS rank_score
    FROM {{ source('raw', 'top_tracks') }}
    WHERE artist_id IS NOT NULL
    GROUP BY artist_id, artist_name
    HAVING COUNT(DISTINCT time_range) = 3
)
SELECT
    artist_id AS id,
    artist_name AS name,
    artist_name,
    NULL AS play_count
FROM artist_periods
ORDER BY periods_appeared DESC, rank_score ASC
LIMIT 1
