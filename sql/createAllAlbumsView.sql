drop view all_albums;
commit;
create view all_albums  as
select
    b.id,
    b.name,
    a.name as "artist",
    b.release_date,
    b.label,
    array_to_string(a.genres, ' | ') as "genres",
    b.image,
    b.spotify_uri
from
    artists a,
    albums b
where
    a.id = b.artist
