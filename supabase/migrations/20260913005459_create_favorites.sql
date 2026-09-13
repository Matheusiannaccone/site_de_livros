create table public.favorites (
    user_id uuid not null,

    book_id uuid not null,

    created_at timestamptz not null default now(),

    constraint fk_favorites_user
        foreign key (user_id)
        references public.profiles(id)
        on delete cascade,

    constraint fk_favorites_book
        foreign key (book_id)
        references public.books(id)
        on delete cascade,

    constraint pk_favorites
        primary key (user_id, book_id)
);