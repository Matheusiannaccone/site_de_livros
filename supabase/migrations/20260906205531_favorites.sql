CREATE TABLE favorites (
    user_id UUID NOT NULL,

    book_id UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (user_id, book_id),

    CONSTRAINT fk_favorites_user
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorites_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);


--Testes

SELECT *
FROM favorites;

INSERT INTO favorites (
    user_id,
    book_id
)
VALUES (
    'ID-DO-USUARIO',
    'ID-DO-LIVRO'
);

SELECT
    f.user_id,
    p.username,
    f.book_id,
    b.title,
    f.created_at
FROM favorites f
JOIN profiles p
    ON p.id = f.user_id
JOIN books b
    ON b.id = f.book_id;