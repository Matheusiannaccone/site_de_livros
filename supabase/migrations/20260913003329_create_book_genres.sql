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