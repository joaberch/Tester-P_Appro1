-- =========================
-- USERS
-- =========================
INSERT INTO t_users (login, firstname, name, hashedPassword, role, isDeleted, createdAt) VALUES
('admin01', 'Alice', 'Admin', 'hash_admin', 'ADMIN', FALSE, '2026-01-10'),
('prof01', 'Bob', 'Martin', 'hash_prof1', 'TEACHER', FALSE, '2026-01-10'),
('prof02', 'Claire', 'Durand', 'hash_prof2', 'TEACHER', FALSE, '2026-01-10'),
('stud001', 'David', 'Bernard', 'hash_stud1', 'STUDENT', FALSE, '2026-01-10'),
('stud002', 'Emma', 'Petit', 'hash_stud2', 'STUDENT', FALSE, '2026-01-10'),
('stud003', 'Lucas', 'Robert', 'hash_stud3', 'STUDENT', FALSE, '2026-01-10');

-- =========================
-- MODULES
-- =========================
INSERT INTO t_modules (name, description, isDeleted) VALUES
('Base de données', 'Introduction aux bases de données relationnelles', FALSE),
('Programmation Java', 'Bases de la programmation orientée objet en Java', FALSE),
('Réseaux', 'Fondamentaux des réseaux informatiques', FALSE);

-- =========================
-- OBJECTIVES
-- =========================
INSERT INTO t_objectives (name, description, bloomLevel, isDeleted, idModule) VALUES
('Modélisation MCD', 'Comprendre et créer un modèle conceptuel de données', 3, FALSE, 1),
('Requêtes SQL', 'Savoir écrire des requêtes SELECT complexes', 4, FALSE, 1),
('POO', 'Comprendre les principes de la programmation orientée objet', 2, FALSE, 2),
('Sockets', 'Comprendre la communication client-serveur', 3, FALSE, 3);

-- =========================
-- TESTS
-- =========================
INSERT INTO t_tests (name, description, duration, isDeleted, isFormative, createdAt, idModule) VALUES
('Test SQL 1', 'Évaluation sur les requêtes SQL', 60, FALSE, TRUE, '2026-01-10', 1),
('Examen BDD', 'Examen final base de données', 120, FALSE, FALSE, '2026-01-15', 1),
('Quiz Java', 'Quiz sur les bases Java', 45, FALSE, TRUE, '2026-01-20', 2);

-- =========================
-- QUESTIONS
-- =========================
INSERT INTO t_questions (question, point, type, isDeleted, idTest) VALUES
('Que signifie SQL ?', 2, 'QCM', FALSE, 1),
('Quelle clause permet de filtrer les résultats ?', 3, 'QCM', FALSE, 1),
('Expliquez la différence entre INNER JOIN et LEFT JOIN.', 5, 'OPEN', FALSE, 2),
('Qu est-ce qu une classe en Java ?', 2, 'QCM', FALSE, 3);

-- =========================
-- ANSWERS
-- =========================
INSERT INTO t_answers (answer, isCorrect, isDeleted, idQuestion) VALUES
('Structured Query Language', TRUE, FALSE, 1),
('Simple Query Language', FALSE, FALSE, 1),
('WHERE', TRUE, FALSE, 2),
('ORDER BY', FALSE, FALSE, 2),
('Une structure définissant des objets', TRUE, FALSE, 4),
('Un type primitif', FALSE, FALSE, 4);

-- =========================
-- ATTACHEMENTS
-- =========================
INSERT INTO t_attachements (file, isDeleted, idTest) VALUES
('diagramme_examen_bdd.pdf', FALSE, 2),
('annexe_sql.pdf', FALSE, 1);

-- =========================
-- CREATED_BY
-- =========================
INSERT INTO created_by (idUser, idTest) VALUES
(2, 1),
(2, 2),
(3, 3);

-- =========================
-- ASSIGNED_TO
-- =========================
INSERT INTO assigned_to (idUser, idTest) VALUES
(4, 1),
(5, 1),
(6, 2),
(4, 3),
(5, 3);
