create table public.chapters (
    id uuid primary key default gen_random_uuid(),

    book_id uuid not null,

    title text,

    content text,

    status text not null default 'draft',

    position integer not null,

    published_at timestamptz,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint fk_chapters_book
        foreign key (book_id)
        references public.books(id)
        on delete cascade,

    constraint chk_chapters_status
        check (status in ('draft', 'published')),

    constraint chk_chapters_position
        check (position > 0),

    constraint uq_chapters_book_position
        unique (book_id, position)
);

alter table public.chapters enable row level security;

create policy "chapters_select_visible"
on public.chapters
for select
using (
    exists (
        select 1
        from public.books b
        where b.id = chapters.book_id
          and (
              (
                  chapters.status = 'published'
                  and b.status = 'published'
              )
              or b.author_id = auth.uid()
          )
    )
);

create policy "chapters_insert_by_book_author"
on public.chapters
for insert
to authenticated
with check (
    exists (
        select 1
        from public.books b
        where b.id = chapters.book_id
          and b.author_id = auth.uid()
    )
);

create policy "chapters_update_by_book_author"
on public.chapters
for update
to authenticated
using (
    exists (
        select 1
        from public.books b
        where b.id = chapters.book_id
          and b.author_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.books b
        where b.id = chapters.book_id
          and b.author_id = auth.uid()
    )
);

create policy "chapters_delete_by_book_author"
on public.chapters
for delete
to authenticated
using (
    exists (
        select 1
        from public.books b
        where b.id = chapters.book_id
          and b.author_id = auth.uid()
    )
);