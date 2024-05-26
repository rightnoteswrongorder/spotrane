create view all_albums_view as
select
    a.name as "artist",
    a.spotify_id as "artist_spotify_id",
    a.genres as "artist_genres",
    array_to_string(a.genres, ' | ') as "artist_genres_searchable",
    b.spotify_id,
    b.name,
    b.release_date,
    b.label,
    b.image,
    b.spotify_uri
from
    artists a,
    albums b
where
    a.spotify_id = b.artist