CREATE DATABASE IF NOT EXISTS game_db;
USE game_db;

-- players
DROP TABLE IF EXISTS players;
CREATE TABLE players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  tokens INT DEFAULT 0,
  xp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- coaches
DROP TABLE IF EXISTS coaches;
CREATE TABLE coaches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  red_flag TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- unlocks log
DROP TABLE IF EXISTS unlocks;
CREATE TABLE unlocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  coach_id INT NOT NULL,
  tokens_spent INT NOT NULL,
  xp_awarded INT NOT NULL,
  red_flag TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

-- xp_history
DROP TABLE IF EXISTS xp_history;
CREATE TABLE xp_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  change_amount INT NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Seed
INSERT INTO players (username, tokens, xp) VALUES ('alice', 50, 10), ('bob', 5, 0);

INSERT INTO coaches (name, red_flag) VALUES
('Coach A', 0),
('Coach B', 1), -- red flag
('Coach C', 0);
