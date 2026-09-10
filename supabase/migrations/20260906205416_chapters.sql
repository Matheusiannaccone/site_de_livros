CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    book_id UUID NOT NULL,

    title TEXT NOT NULL,

    content TEXT,

    status TEXT NOT NULL DEFAULT 'draft',

    position INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_chapters_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_chapters_status
        CHECK (status IN ('draft', 'published')),

    CONSTRAINT chk_chapters_position
        CHECK (position > 0),

    CONSTRAINT uq_chapters_book_position
        UNIQUE (book_id, position)
);


--Testes

SELECT id, title, status
FROM chapters;

UPDATE chapters
SET status = 'published'
WHERE id = 'ID-DO-CAPITULO';