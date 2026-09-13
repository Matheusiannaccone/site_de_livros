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