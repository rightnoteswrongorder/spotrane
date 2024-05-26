create or replace function search_all_albums(keyword text)
returns setof all_albums_view
as
$func$
select
    *
from
    all_albums_view
where
    to_tsvector(artist || ' ' || name || ' ' || label || ' ' || artist_genres_searchable) -- concat columns, but be sure to include a space to separate them!
        @@ to_tsquery(keyword);
$func$
language sql;