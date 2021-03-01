CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);