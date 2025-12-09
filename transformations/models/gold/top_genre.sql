{{ config(materialized='view') }}

WITH genre_counts AS (
    SELECT 
        g.genre,
        COUNT(*) AS play_count
    FROM {{ ref('streams') }} s,
    LATERAL UNNEST(s.genres) AS g(genre)
    GROUP BY 1
)

SELECT *
FROM genre_counts
ORDER BY play_count DESC
LIMIT 1
