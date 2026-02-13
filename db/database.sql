CREATE DATABASE IF NOT EXISTS db_tester CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE db_tester;

CREATE TABLE IF NOT EXISTS t_users(
   idUser INT NOT NULL AUTO_INCREMENT,
   login CHAR(7),
   firstname VARCHAR(100),
   name VARCHAR(100),
   hashedPassword VARCHAR(100),
   role VARCHAR(50),
   isDeleted BOOLEAN,
   createdAt DATE,
   PRIMARY KEY(idUser),
   UNIQUE(login)
);

CREATE TABLE IF NOT EXISTS t_modules(
   idModule INT NOT NULL AUTO_INCREMENT,
   name VARCHAR(100),
   description VARCHAR(1000),
   isDeleted BOOLEAN,
   PRIMARY KEY(idModule)
);

CREATE TABLE IF NOT EXISTS t_objectives(
   idObjective INT NOT NULL AUTO_INCREMENT,
   name VARCHAR(100),
   description VARCHAR(1000),
   bloomLevel TINYINT,
   isDeleted BOOLEAN,
   idModule INT NOT NULL,
   PRIMARY KEY(idObjective),
   FOREIGN KEY(idModule) REFERENCES t_modules(idModule)
);

CREATE TABLE IF NOT EXISTS t_tests(
   idTest INT NOT NULL AUTO_INCREMENT,
   name VARCHAR(50),
   description VARCHAR(100),
   duration INT,
   isDeleted BOOLEAN,
   isFormative BOOLEAN,
   createdAt DATE,
   idModule INT NOT NULL,
   PRIMARY KEY(idTest),
   FOREIGN KEY(idModule) REFERENCES t_modules(idModule)
);

CREATE TABLE IF NOT EXISTS t_questions(
   idQuestion INT NOT NULL AUTO_INCREMENT,
   question VARCHAR(1000),
   point INT,
   type VARCHAR(100),
   isDeleted BOOLEAN,
   idTest INT NOT NULL,
   PRIMARY KEY(idQuestion),
   FOREIGN KEY(idTest) REFERENCES t_tests(idTest)
);

CREATE TABLE IF NOT EXISTS t_attachements(
   idAttachement INT NOT NULL AUTO_INCREMENT,
   file TEXT,
   isDeleted BOOLEAN,
   idTest INT NOT NULL,
   PRIMARY KEY(idAttachement),
   FOREIGN KEY(idTest) REFERENCES t_tests(idTest)
);

CREATE TABLE IF NOT EXISTS t_answers(
   idAnswer INT NOT NULL AUTO_INCREMENT,
   answer VARCHAR(1000),
   isCorrect BOOLEAN,
   isDeleted BOOLEAN,
   idQuestion INT NOT NULL,
   PRIMARY KEY(idAnswer),
   FOREIGN KEY(idQuestion) REFERENCES t_questions(idQuestion)
);

CREATE TABLE IF NOT EXISTS assigned_to(
   idUser INT,
   idTest INT,
   PRIMARY KEY(idUser, idTest),
   FOREIGN KEY(idUser) REFERENCES t_users(idUser),
   FOREIGN KEY(idTest) REFERENCES t_tests(idTest)
);

CREATE TABLE IF NOT EXISTS created_by(
   idUser INT,
   idTest INT,
   PRIMARY KEY(idUser, idTest),
   FOREIGN KEY(idUser) REFERENCES t_users(idUser),
   FOREIGN KEY(idTest) REFERENCES t_tests(idTest)
);
