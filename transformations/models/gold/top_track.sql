{{ config(materialized='view') }}
WITH play_counts AS (
    SELECT 
        track_id,
        track_name,
        artist_id,
        artist_name,
        COUNT(*) AS play_count
    FROM {{ ref('streams') }}
    GROUP BY 1, 2, 3, 4
)

SELECT
    track_id,
    track_name,
    artist_id,
    artist_name,
    play_count
FROM play_counts
ORDER BY play_count DESC
LIMIT 1
