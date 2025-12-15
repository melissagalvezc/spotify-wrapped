{{ config(materialized='view') }}
WITH genre_periods AS (
    SELECT
        g.genre,
        tt.time_range,
        tt.rank
    FROM {{ source('raw', 'top_tracks') }} tt
    INNER JOIN {{ source('raw', 'artists') }} a ON tt.artist_id = a.artist_id
    CROSS JOIN LATERAL UNNEST(a.genres) AS g(genre)
    WHERE tt.artist_id IS NOT NULL
      AND a.genres IS NOT NULL
      AND array_length(a.genres, 1) > 0
),
genre_aggregated AS (
    SELECT
        genre,
        COUNT(DISTINCT time_range) AS periods_appeared,
        SUM(rank) AS rank_score
    FROM genre_periods
    GROUP BY genre
    HAVING COUNT(DISTINCT time_range) = 3
)
SELECT
    genre,
    genre AS name,
    NULL AS play_count
FROM genre_aggregated
ORDER BY periods_appeared DESC, rank_score ASC
LIMIT 1
