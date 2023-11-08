-- MySQL 8.10.11

# TODO: Triggers no funcionan en MySQL.

/**
 * Create a new user and a new database
 */
-- DROP USER 'moviesdb'@'localhost';
# CREATE USER 'moviesdb'@'localhost' IDENTIFIED BY 'moviesdb';
# GRANT ALL PRIVILEGES ON moviesdb.* TO 'moviesdb'@'localhost';
# FLUSH PRIVILEGES;

# CREATE DATABASE moviesdb;

USE moviesdb;

-- DROP TABLE movie_genres, genres, movies;

CREATE TABLE movies
(
    id       BINARY(16)             NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
    title    VARCHAR(255)           NOT NULL,
    year     INT UNSIGNED           NOT NULL,
    director VARCHAR(255)           NOT NULL,
    duration INT                    NOT NULL,
    poster   TEXT                   NOT NULL,
    rate     DECIMAL(2, 1)          NOT NULL,
    CONSTRAINT pk_movies PRIMARY KEY (id),
    CONSTRAINT uq_movies_title_year UNIQUE (title, year),
    CONSTRAINT ck_movies_rate CHECK (rate >= 0 AND rate <= 10),
    CONSTRAINT ck_movies_duration CHECK (duration > 0),
    CONSTRAINT ck_movies_director CHECK (director <> ''),
    CONSTRAINT ck_movies_title CHECK (title <> ''),
    CONSTRAINT ck_movies_poster CHECK (poster <> '')
);

CREATE TABLE genres
(
    id   BINARY(16)     NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255)   NOT NULL,
    CONSTRAINT pk_genres PRIMARY KEY (id),
    CONSTRAINT uq_genres_name UNIQUE (name)
);

CREATE TABLE movie_genres
(
    movie_id BINARY(16) NOT NULL,
    genre_id BINARY(16) NOT NULL,
    PRIMARY KEY (movie_id, genre_id)
);

-- Crear indices para las tablas
CREATE INDEX idx_movies_title ON movies (title);
CREATE INDEX idx_genres_name ON genres (name);

-- Insertar géneros en la tabla genres
INSERT INTO genres (name)
VALUES ('Drama'),
       ('Animation'),
       ('Action'),
       ('Crime'),
       ('Adventure'),
       ('Sci-Fi'),
       ('Romance'),
       ('Biography'),
       ('Fantasy');

-- Insertar películas en la tabla movies
INSERT INTO movies (id, title, year, director, duration, poster, rate)
VALUES
    (UUID_TO_BIN('dcdd0fad-a94c-4810-8acc-5f108d3b18c3'), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142,
     'https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp', 9.3),
    (UUID_TO_BIN('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf'), 'The Dark Knight', 2008, 'Christopher Nolan', 152,
     'https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg', 9.0),
    (UUID_TO_BIN('5ad1a235-0d9c-410a-b32b-220d91689a08'), 'Inception', 2010, 'Christopher Nolan', 148,
     'https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg', 8.8),
    (UUID_TO_BIN('241bf55d-b649-4109-af7c-0e6890ded3fc'), 'Pulp Fiction', 1994, 'Quentin Tarantino', 154,
     'https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', 8.9),
    (UUID_TO_BIN('9e6106f0-848b-4810-a11a-3d832a5610f9'), 'Forrest Gump', 1994, 'Robert Zemeckis', 142,
     'https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg', 8.8),
    (UUID_TO_BIN('7e3fd5ab-60ff-4ae2-92b6-9597f0308d10'), 'Gladiator', 2000, 'Ridley Scott', 155,
     'https://img.fruugo.com/product/0/60/14417600_max.jpg', 8.5),
    (UUID_TO_BIN('c906673b-3948-4402-ac7f-73ac3a9e3105'), 'The Matrix', 1999, 'Lana Wachowski', 136,
     'https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg', 8.7),
    (UUID_TO_BIN('b6e03689-cccd-478e-8565-d92f40813b13'), 'Interstellar', 2014, 'Christopher Nolan', 169,
     'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg', 8.6),
    (UUID_TO_BIN('aa391090-b938-42eb-b520-86ea0aa3917b'), 'The Lord of the Rings: The Return of the King', 2003, 'Peter Jackson',
     201, 'https://i.ebayimg.com/images/g/0hoAAOSwe7peaMLW/s-l1600.jpg', 8.9),
    (UUID_TO_BIN('2e6900e2-0b48-4fb6-ad48-09c7086e54fe'), 'The Lion King', 1994, 'Roger Allers, Rob Minkoff', 88,
     'https://m.media-amazon.com/images/I/81BMmrwSFOL._AC_UF1000,1000_QL80_.jpg', 8.5),
    (UUID_TO_BIN('04986507-b3ed-442c-8ae7-4c5df804f896'), 'The Avengers', 2012, 'Joss Whedon', 143,
     'https://img.fruugo.com/product/7/41/14532417_max.jpg', 8.0),
    (UUID_TO_BIN('7d2832f8-c70a-410e-8963-4c93bf36cc9c'), 'Jurassic Park', 1993, 'Steven Spielberg', 127,
     'https://vice-press.com/cdn/shop/products/Jurassic-Park-Editions-poster-florey.jpg?v=1654518755&width=1024',
     8.1),
    (UUID_TO_BIN('ccf36f2e-8566-47f7-912d-9f4647250bc7'), 'Titanic', 1997, 'James Cameron', 195,
     'https://i.pinimg.com/originals/42/42/65/4242658e6f1b0d6322a4a93e0383108b.png', 7.8),
    (UUID_TO_BIN('8fb17ae1-bdfe-45e5-a871-4772d7e526b8'), 'The Social Network', 2010, 'David Fincher', 120,
     'https://i.pinimg.com/originals/7e/37/b9/7e37b994b613e94cba64f307b1983e39.jpg', 7.7),
    (UUID_TO_BIN('6a360a18-c645-4b47-9a7b-2a71babbf3e0'), 'Avatar', 2009, 'James Cameron', 162,
     'https://i.etsystatic.com/35681979/r/il/dfe3ba/3957859451/il_fullxfull.3957859451_h27r.jpg', 7.8);

INSERT INTO movie_genres (movie_id, genre_id)
VALUES
    (UUID_TO_BIN('241bf55d-b649-4109-af7c-0e6890ded3fc'), (SELECT id FROM genres WHERE name = 'Crime')),
    (UUID_TO_BIN('241bf55d-b649-4109-af7c-0e6890ded3fc'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('9e6106f0-848b-4810-a11a-3d832a5610f9'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('9e6106f0-848b-4810-a11a-3d832a5610f9'), (SELECT id FROM genres WHERE name = 'Romance')),
    (UUID_TO_BIN('7e3fd5ab-60ff-4ae2-92b6-9597f0308d10'), (SELECT id FROM genres WHERE name = 'Action')),
    (UUID_TO_BIN('7e3fd5ab-60ff-4ae2-92b6-9597f0308d10'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('7e3fd5ab-60ff-4ae2-92b6-9597f0308d10'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('c906673b-3948-4402-ac7f-73ac3a9e3105'), (SELECT id FROM genres WHERE name = 'Action')),
    (UUID_TO_BIN('c906673b-3948-4402-ac7f-73ac3a9e3105'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
    (UUID_TO_BIN('b6e03689-cccd-478e-8565-d92f40813b13'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('b6e03689-cccd-478e-8565-d92f40813b13'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('b6e03689-cccd-478e-8565-d92f40813b13'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
    (UUID_TO_BIN('aa391090-b938-42eb-b520-86ea0aa3917b'), (SELECT id FROM genres WHERE name = 'Action')),
    (UUID_TO_BIN('aa391090-b938-42eb-b520-86ea0aa3917b'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('aa391090-b938-42eb-b520-86ea0aa3917b'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('2e6900e2-0b48-4fb6-ad48-09c7086e54fe'), (SELECT id FROM genres WHERE name = 'Animation')),
    (UUID_TO_BIN('2e6900e2-0b48-4fb6-ad48-09c7086e54fe'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('2e6900e2-0b48-4fb6-ad48-09c7086e54fe'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('04986507-b3ed-442c-8ae7-4c5df804f896'), (SELECT id FROM genres WHERE name = 'Action')),
    (UUID_TO_BIN('04986507-b3ed-442c-8ae7-4c5df804f896'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('04986507-b3ed-442c-8ae7-4c5df804f896'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
    (UUID_TO_BIN('7d2832f8-c70a-410e-8963-4c93bf36cc9c'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('7d2832f8-c70a-410e-8963-4c93bf36cc9c'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
    (UUID_TO_BIN('ccf36f2e-8566-47f7-912d-9f4647250bc7'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('ccf36f2e-8566-47f7-912d-9f4647250bc7'), (SELECT id FROM genres WHERE name = 'Romance')),
    (UUID_TO_BIN('8fb17ae1-bdfe-45e5-a871-4772d7e526b8'), (SELECT id FROM genres WHERE name = 'Biography')),
    (UUID_TO_BIN('8fb17ae1-bdfe-45e5-a871-4772d7e526b8'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('6a360a18-c645-4b47-9a7b-2a71babbf3e0'), (SELECT id FROM genres WHERE name = 'Action')),
    (UUID_TO_BIN('6a360a18-c645-4b47-9a7b-2a71babbf3e0'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('6a360a18-c645-4b47-9a7b-2a71babbf3e0'), (SELECT id FROM genres WHERE name = 'Fantasy')),
    (UUID_TO_BIN('5ad1a235-0d9c-410a-b32b-220d91689a08'), (SELECT id FROM genres WHERE name = 'Action')),
    (UUID_TO_BIN('5ad1a235-0d9c-410a-b32b-220d91689a08'), (SELECT id FROM genres WHERE name = 'Adventure')),
    (UUID_TO_BIN('5ad1a235-0d9c-410a-b32b-220d91689a08'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
    (UUID_TO_BIN('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf'), (SELECT id FROM genres WHERE name = 'Action')),
    (UUID_TO_BIN('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf'), (SELECT id FROM genres WHERE name = 'Crime')),
    (UUID_TO_BIN('c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf'), (SELECT id FROM genres WHERE name = 'Drama')),
    (UUID_TO_BIN('dcdd0fad-a94c-4810-8acc-5f108d3b18c3'), (SELECT id FROM genres WHERE name = 'Drama'));
