USE db_tester;

-- ======================
-- USERS
-- ======================
INSERT INTO t_users VALUES
('admin1', '$2y$10$hashedadmin', 'ADMIN', FALSE),
('teacher1', '$2y$10$hashedteacher', 'TEACHER', FALSE),
('teacher2', '$2y$10$hashedteacher2', 'TEACHER', FALSE),
('student1', '$2y$10$hashedstudent1', 'STUDENT', FALSE),
('student2', '$2y$10$hashedstudent2', 'STUDENT', FALSE),
('student3', '$2y$10$hashedstudent3', 'STUDENT', TRUE); -- utilisateur supprimé

-- ======================
-- MODULES
-- ======================
INSERT INTO t_modules VALUES
('MATH101', 'Mathématiques', 'Module de mathématiques générales', FALSE),
('PROG101', 'Programmation Java', 'Introduction à la programmation orientée objet', FALSE),
('DB101', 'Bases de données', 'Conception et manipulation de bases relationnelles', FALSE);

-- ======================
-- OBJECTIVES
-- ======================
INSERT INTO t_objectives VALUES
('OBJ1', 'Comprendre les fonctions', 'Maîtriser les fonctions de base', 2, FALSE, 'MATH101'),
('OBJ2', 'Résoudre des équations', 'Savoir résoudre des équations du second degré', 3, FALSE, 'MATH101'),
('OBJ3', 'Comprendre les classes', 'Créer et utiliser des classes en Java', 2, FALSE, 'PROG101'),
('OBJ4', 'Maîtriser les jointures', 'Comprendre les jointures SQL', 4, FALSE, 'DB101');

-- ======================
-- TESTS
-- ======================
INSERT INTO t_tests VALUES
('TEST1', 'Test Math 1', 'Evaluation sur les fonctions', 60, 'FALSE', TRUE, 'MATH101'),
('TEST2', 'Test Java 1', 'QCM sur les bases Java', 45, 'FALSE', TRUE, 'PROG101'),
('TEST3', 'Examen BD', 'Examen final bases de données', 90, 'FALSE', FALSE, 'DB101');

-- ======================
-- QUESTIONS
-- ======================
INSERT INTO t_questions VALUES
('Q1', 'Quelle est la dérivée de x² ?', 2, 'QCM', FALSE, 'TEST1'),
('Q2', 'Résoudre : x² - 4 = 0', 3, 'QCM', FALSE, 'TEST1'),
('Q3', 'Quel mot-clé permet de définir une classe en Java ?', 1, 'QCM', FALSE, 'TEST2'),
('Q4', 'Quelle jointure permet de récupérer toutes les lignes de la table A ?', 3, 'QCM', FALSE, 'TEST3');

-- ======================
-- REPONSES
-- ======================
INSERT INTO id_reponses VALUES
(1, '2x', TRUE, 'Q1'),
(2, 'x', FALSE, 'Q1'),
(3, 'x²', FALSE, 'Q1'),

(4, 'x = 2 ou x = -2', TRUE, 'Q2'),
(5, 'x = 4', FALSE, 'Q2'),

(6, 'class', TRUE, 'Q3'),
(7, 'define', FALSE, 'Q3'),

(8, 'LEFT JOIN', TRUE, 'Q4'),
(9, 'RIGHT JOIN', FALSE, 'Q4'),
(10, 'INNER JOIN', FALSE, 'Q4');

-- ======================
-- ATTACHEMENTS
-- ======================
INSERT INTO t_attachements VALUES
('ATT1', 'formulaire_math.pdf', 'TEST1'),
('ATT2', 'schema_bd.png', 'TEST3');

-- ======================
-- ASSIGNED_TO
-- ======================
INSERT INTO assigned_to VALUES
('student1', 'TEST1'),
('student1', 'TEST2'),
('student2', 'TEST1'),
('student2', 'TEST3');

-- ======================
-- CREATED_BY
-- ======================
INSERT INTO created_by VALUES
('teacher1', 'TEST1'),
('teacher2', 'TEST2'),
('teacher2', 'TEST3');
