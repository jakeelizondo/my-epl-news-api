CREATE TABLE users_articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER 
        REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER 
        REFERENCES articles(id)
);