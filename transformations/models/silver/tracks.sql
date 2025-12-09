{{ config(materialized='view') }}

SELECT 
    track_id,
    track_name,
    album_name,
    duration_ms,
    artist_ids,
    popularity
FROM {{ source('raw', 'tracks') }}
