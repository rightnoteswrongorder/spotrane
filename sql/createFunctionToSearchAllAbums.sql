create or replace function search_all_albums(keyword text)
returns setof all_abums
as
$func$
select
    *
from
    all_albums
where
    to_tsvector(artist || ' ' || name || ' ' || label || ' ' || genres) -- concat columns, but be sure to include a space to separate them!
        @@ to_tsquery(keyword);
$func$
language sql;