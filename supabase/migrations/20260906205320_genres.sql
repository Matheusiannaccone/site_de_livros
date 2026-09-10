CREATE TABLE genres (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name TEXT NOT NULL UNIQUE,

    slug TEXT NOT NULL UNIQUE
);

INSERT INTO genres (name, slug)
VALUES
    ('Fantasia', 'fantasia'),
    ('Romance', 'romance'),
    ('Terror', 'terror'),
    ('Ficção Científica', 'ficcao-cientifica'),
    ('Aventura', 'aventura'),
    ('Mistério', 'misterio'),
    ('Drama', 'drama'),
    ('Suspense', 'suspense'),
    ('Comédia', 'comedia'),
    ('História', 'historia');

    SELECT *
FROM genres;