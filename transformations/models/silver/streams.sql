{{ config(materialized='view') }}

SELECT 
    s.stream_id,
    s.played_at,
    s.track_id,
    t.track_name,
    s.artist_id,
    a.artist_name,
    a.genres
FROM {{ source('raw', 'streams') }} s
LEFT JOIN {{ source('raw', 'tracks') }} t ON s.track_id = t.track_id
LEFT JOIN {{ source('raw', 'artists') }} a ON s.artist_id = a.artist_id