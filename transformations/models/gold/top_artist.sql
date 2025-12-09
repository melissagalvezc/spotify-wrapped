{{ config(materialized='view') }}

WITH artist_counts AS (
    SELECT 
        artist_id,
        artist_name,
        COUNT(*) AS play_count
    FROM {{ ref('streams') }}
    GROUP BY 1, 2
)

SELECT *
FROM artist_counts
ORDER BY play_count DESC
LIMIT 1
