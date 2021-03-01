CREATE TABLE users_articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER 
        REFERENCES users(id),
    article_id INTEGER 
        REFERENCES articles(id)
);