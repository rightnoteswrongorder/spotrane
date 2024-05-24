drop view all_albums;
commit;
create view all_albums  as
select
    b.spotify_id,
    b.name,
    a.name as "artist",
    a.spotify_id as "artist_id"
    b.release_date,
    b.label,
    array_to_string(a.genres, ' | ') as "genres",
    b.image,
    b.spotify_uri
from
    artists a,
    albums b
where
    a.spotify_id = b.artist