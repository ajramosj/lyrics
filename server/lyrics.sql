# mysql> source lyrics.sql

# Create database
DROP DATABASE IF EXISTS lyrics;
CREATE DATABASE lyrics;
USE lyrics;
SELECT DATABASE();

# Create tables
CREATE TABLE users(
    username VARCHAR(30) NOT NULL,
    password VARCHAR(16) NOT NULL,
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE songs(
    title VARCHAR(50) NOT NULL,
    author VARCHAR(20) NOT NULL,
    song_lines JSON NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    song_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
);

# Insert sample data
INSERT INTO users VALUES('username1','P@ssw0rd',NULL);
INSERT INTO users VALUES('username2','P@ssw0rd',NULL);
INSERT INTO songs VALUES('Title 1','Author 1','{"lyrics": ["Line 1", "Line 2", "Line 3"], "timeStamps": [1000, 2000, 3000]}',1,NULL);
INSERT INTO songs VALUES('Title 2','Author 2','{"lyrics": ["Line 4", "Line 5"], "timeStamps": [4000, 5000]}',1,NULL);
INSERT INTO songs VALUES('Title 3','Author 3','{"lyrics": ["Line 6"], "timeStamps": [6000] }',1,NULL);

# Show inserted data
DESCRIBE users;
DESCRIBE songs;

SELECT * FROM users;
SELECT * FROM songs;

SELECT users.username AS User, COUNT(songs.song_id) AS Nsongs
FROM users LEFT JOIN songs ON users.user_id = songs.user_id
GROUP BY users.user_id;