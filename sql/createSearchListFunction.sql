create or replace function albums_on_list(list_name text)
    returns setof all_albums
as
$$
begin
    return query (select *
                  from all_albums
                  where id in (select album_id
                               from lists,
                                    list_entry
                               where lists.id = list_entry.list_id
                                 and lists.id = list_entry.list_id
                                 and lists.name = list_name));
end;
$$ language plpgsql;
commit;
