create table public.book_genres (
    book_id uuid not null,

    genre_id integer not null,

    constraint fk_book_genres_book
        foreign key (book_id)
        references public.books(id)
        on delete cascade,

    constraint fk_book_genres_genre
        foreign key (genre_id)
        references public.genres(id)
        on delete restrict,

    constraint pk_book_genres
        primary key (book_id, genre_id)
);

alter table public.book_genres enable row level security;

create policy "book_genres_select_visible"
on public.book_genres
for select
using (
    exists (
        select 1
        from public.books b
        where b.id = book_genres.book_id
          and (
              b.status = 'published'
              or b.author_id = auth.uid()
          )
    )
);

create policy "book_genres_insert_by_book_author"
on public.book_genres
for insert
to authenticated
with check (
    exists (
        select 1
        from public.books b
        where b.id = book_genres.book_id
          and b.author_id = auth.uid()
    )
);

create policy "book_genres_delete_by_book_author"
on public.book_genres
for delete
to authenticated
using (
    exists (
        select 1
        from public.books b
        where b.id = book_genres.book_id
          and b.author_id = auth.uid()
    )
);