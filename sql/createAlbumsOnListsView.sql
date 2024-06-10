create view albums_on_lists as
select l.name as list_name, le.id as list_entry_id, le.position as list_entry_position aa.*
from lists l, list_entry le, all_albums_view aa
where l.id = le.list_id
  and le.album_id = aa.spotify_id