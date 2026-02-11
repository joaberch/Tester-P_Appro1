CREATE DATABASE IF NOT EXISTS tester CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE tester;

CREATE TABLE IF NOT EXISTS t_users(
   idUsers VARCHAR(150),
   hashed_password VARCHAR(100),
   role VARCHAR(50),
   isDeleted BOOLEAN,
   PRIMARY KEY(idUsers)
);

CREATE TABLE IF NOT EXISTS t_modules(
   IdModules VARCHAR(50),
   name VARCHAR(100),
   description VARCHAR(1000),
   isDeleted BOOLEAN,
   PRIMARY KEY(IdModules)
);

CREATE TABLE IF NOT EXISTS t_objectives(
   IdObjectives VARCHAR(50),
   name VARCHAR(100),
   description VARCHAR(1000),
   bloom_level TINYINT,
   isDeleted BOOLEAN,
   IdModules VARCHAR(50) NOT NULL,
   PRIMARY KEY(IdObjectives),
   FOREIGN KEY(IdModules) REFERENCES t_modules(IdModules)
);

CREATE TABLE IF NOT EXISTS t_tests(
   idTests VARCHAR(50),
   name VARCHAR(50),
   description VARCHAR(100),
   duration INT,
   isDeleted VARCHAR(50),
   isFormative BOOLEAN,
   IdModules VARCHAR(50) NOT NULL,
   PRIMARY KEY(idTests),
   FOREIGN KEY(IdModules) REFERENCES t_modules(IdModules)
);

CREATE TABLE IF NOT EXISTS t_questions(
   IdQuestions VARCHAR(50),
   question VARCHAR(1000),
   point INT,
   type VARCHAR(100),
   isDeleted BOOLEAN,
   idTests VARCHAR(50) NOT NULL,
   PRIMARY KEY(IdQuestions),
   FOREIGN KEY(idTests) REFERENCES t_tests(idTests)
);

CREATE TABLE IF NOT EXISTS t_attachements(
   idAttachements VARCHAR(50),
   file TEXT,
   idTests VARCHAR(50) NOT NULL,
   PRIMARY KEY(idAttachements),
   FOREIGN KEY(idTests) REFERENCES t_tests(idTests)
);

CREATE TABLE IF NOT EXISTS id_reponses(
   idReponse INT,
   reponse VARCHAR(1000),
   isCorrect BOOLEAN,
   IdQuestions VARCHAR(50) NOT NULL,
   PRIMARY KEY(idReponse),
   FOREIGN KEY(IdQuestions) REFERENCES t_questions(IdQuestions)
);

CREATE TABLE IF NOT EXISTS assigned_to(
   idUsers VARCHAR(150),
   idTests VARCHAR(50),
   PRIMARY KEY(idUsers, idTests),
   FOREIGN KEY(idUsers) REFERENCES t_users(idUsers),
   FOREIGN KEY(idTests) REFERENCES t_tests(idTests)
);

CREATE TABLE IF NOT EXISTS created_by(
   idUsers VARCHAR(150),
   idTests VARCHAR(50),
   PRIMARY KEY(idUsers, idTests),
   FOREIGN KEY(idUsers) REFERENCES t_users(idUsers),
   FOREIGN KEY(idTests) REFERENCES t_tests(idTests)
);
