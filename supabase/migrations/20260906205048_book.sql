CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    author_id UUID,

    title TEXT NOT NULL,

    description TEXT,

    cover_path TEXT,

    status TEXT NOT NULL DEFAULT 'draft',

    publication_status TEXT NOT NULL DEFAULT 'ongoing',

    language TEXT NOT NULL DEFAULT 'pt-BR',

    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_books_author
        FOREIGN KEY (author_id)
        REFERENCES profiles(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_books_status
        CHECK (status IN ('draft', 'published')),

    CONSTRAINT chk_books_publication_status
        CHECK (
            publication_status IN (
                'ongoing',
                'completed',
                'discontinued'
            )
        )
);