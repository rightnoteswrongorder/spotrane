create view albums_on_lists as
select l.name as list_name, aa.*
from lists l, list_entry le, all_albums aa
where l.id = le.list_id
  and le.album_id = aa.id