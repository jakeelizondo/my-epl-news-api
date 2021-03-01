CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    team TEXT NOT NULL,
    source TEXT,
    author TEXT,
    title TEXT,
    description TEXT,
    article_url TEXT,
    image_url TEXT,
    published_at DATE,
    content TEXT,
    date_added TIMESTAMPTZ NOT NULL DEFAULT now()
);