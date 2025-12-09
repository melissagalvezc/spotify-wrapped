{{ config(materialized='view') }}

SELECT 
    artist_id,
    artist_name,
    genres,
    followers,
    popularity
FROM {{ source('raw', 'artists') }}
