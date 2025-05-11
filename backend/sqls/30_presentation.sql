INSERT INTO Subjects (title, description) VALUES
  ('TEAP', 'Development of Effective Algorithms and Programs'),
  ('MTAA', 'Mobile Technologies and Applications'),
  ('DBS', 'Database Systems'),
  ('TZIV', 'Theoretical Foundations of Information Sciences'),
  ('RUST', 'Programming in Rust language'),
  ('PSI', 'Principles of Software Engineering');

INSERT INTO User_Subjects (user_id, subject_id) VALUES
  (3, 1),(3, 2),(3, 3),(3, 4),(3, 5),(3, 6),

  (1, 2),(1, 3);

INSERT INTO Lectures (subject_id, from_time, to_time, day) VALUES
  (1, '2025-01-01 18:00:00', '2025-01-01 19:50:00', 'Tuesday'),
  (2, '2025-01-01 14:00:00', '2025-01-01 15:50:00', 'Thursday'),
  (3, '2025-01-01 09:00:00', '2025-01-01 10:50:00', 'Tuesday'),
  (4, '2025-01-01 11:00:00', '2025-01-01 12:50:00', 'Tuesday'),
  (5, '2025-01-01 14:00:00', '2025-01-01 15:50:00', 'Wednesday'),
  (6, '2025-01-01 16:00:00', '2025-01-01 18:50:00', 'Thursday');

INSERT INTO User_Lectures (user_id, lecture_id) VALUES
  (3, 1),(3, 2),(3, 3),(3, 4),(3, 5),(3, 6),
  (1, 2),(1, 3);

INSERT INTO Seminars (subject_id, from_time, to_time, day) VALUES
(1, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Monday'), -- Subject 1 (TEAP)
(1, '2025-01-01 10:00:00', '2025-01-01 11:50:00', 'Wednesday'),
(1, '2025-01-01 12:00:00', '2025-01-01 13:50:00', 'Thursday'),
(1, '2025-01-01 16:00:00', '2025-01-01 17:50:00', 'Monday'),

(2, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Monday'), -- Subject 2 (MTAA)
(2, '2025-01-01 10:00:00', '2025-01-01 11:50:00', 'Wednesday'),
(2, '2025-01-01 16:00:00', '2025-01-01 17:50:00', 'Tuesday'),
(2, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Thursday'),

(3, '2025-01-01 11:00:00', '2025-01-01 12:50:00', 'Monday'), -- Subject 3 (DBS)
(3, '2025-01-01 14:00:00', '2025-01-01 15:50:00', 'Monday'),
(3, '2025-01-01 11:00:00', '2025-01-01 12:50:00', 'Wednesday'),
(3, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Thursday'),

(4, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Monday'), -- Subject 4 (TZIV)
(4, '2025-01-01 14:00:00', '2025-01-01 15:50:00', 'Monday'),
(4, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Wednesday'),
(4, '2025-01-01 12:00:00', '2025-01-01 13:50:00', 'Thursday'),

(5, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Monday'), -- Subject 5 (RUST)
(5, '2025-01-01 16:00:00', '2025-01-01 17:50:00', 'Tuesday'),
(5, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Thursday'),
(5, '2025-01-01 12:00:00', '2025-01-01 13:50:00', 'Thursday'),

(6, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Tuesday'), -- Subject 6 (PSI)
(6, '2025-01-01 10:00:00', '2025-01-01 11:50:00', 'Wednesday'),
(6, '2025-01-01 08:00:00', '2025-01-01 09:50:00', 'Thursday'),
(6, '2025-01-01 12:00:00', '2025-01-01 13:50:00', 'Thursday');

INSERT INTO User_Seminars (user_id, seminar_id) VALUES
  (1, 5),(1, 6),(1, 7),(1, 8),(1, 9),(1, 10),(1, 11),(1, 12),
  (3, 2),(3, 5),(3, 11),(3, 14),(3, 20),(3, 24);  


INSERT INTO Events (subject_id, title, type, date_till) VALUES
(1, 'Limits Worksheet',         'assignment', '2025-05-13 23:59:00'), -- Subject 1: TEAP
(1, 'Function Design Task',     'assignment', '2025-05-20 23:59:00'),
(1, 'TEAP Final Exam',          'exam',       '2025-06-05 09:00:00'),

(2, 'Mobile UI Assignment',     'assignment', '2025-05-14 23:59:00'), -- Subject 2: MTAA
(2, 'Android Feature Design',   'assignment', '2025-05-22 23:59:00'),
(2, 'MTAA Midterm Exam',        'exam',       '2025-05-14 09:00:00'),

(3, 'ER Diagram Exercise',      'assignment', '2025-05-15 23:59:00'), -- Subject 3: DBS
(3, 'SQL Query Optimization',   'assignment', '2025-05-24 23:59:00'),
(3, 'DBS Final Exam',           'exam',       '2025-05-14 11:00:00'),

(4, 'Theory Homework 1',        'assignment', '2025-05-17 23:59:00'), -- Subject 4: TZIV
(4, 'Formal Methods Worksheet', 'assignment', '2025-05-25 23:59:00'),
(4, 'TZIV Exam',                'exam',       '2025-05-14 13:00:00'),

(5, 'Rust Ownership Task',      'assignment', '2025-05-16 23:59:00'), -- Subject 5: RUST
(5, 'Concurrency Mini-Project', 'assignment', '2025-05-22 23:59:00'),
(5, 'Rust Programming Exam',    'exam',       '2025-06-02 10:00:00'),

(6, 'Design Patterns Quiz',     'assignment', '2025-05-18 23:59:00'), -- Subject 6: PSI
(6, 'Refactoring Report',       'assignment', '2025-05-25 23:59:00'),
(6, 'PSI Exam',                 'exam',       '2025-06-03 14:00:00');


INSERT INTO User_Events (user_id, event_id) VALUES
  (3, 1), (3, 2), (3, 3),
  (3, 4), (3, 5), (3, 6),
  (3, 7), (3, 8), (3, 9),
  (3, 10), (3, 11), (3, 12),
  (3, 13), (3, 14), (3, 15),
  (3, 16), (3, 17), (3, 18),

  (1, 4), (1, 5), (1, 6),
  (1, 7), (1, 8), (1, 9);


INSERT INTO Evaluations (user_id, subject_id, title, points, max_points) VALUES
(3, 1, 'TEAP Midterm', 75, 100),
(3, 1, 'Algorithm Worksheet', 18, 20),

(3, 2, 'Mobile UI Quiz', 45, 50),
(3, 2, 'MTAA Final Project', 89, 100),

(3, 3, 'ER Modeling Test', 40, 50),

(3, 4, 'Formal Logic Assignment', 17, 20),
(3, 4, 'TZIV Midterm', 84, 100),
(3, 4, 'Theory Quiz', 8, 10),

(3, 5, 'Rust Concurrency Task', 20, 25),
(3, 5, 'Rust Final Exam', 91, 100),

(3, 6, 'Software Design Test', 42, 50);

INSERT INTO Posts (user_id, title, text, image) -- Mock posts
SELECT
	(random() * 2 + 1)::int,
	titles[ceil(random() * array_length(titles, 1))::int],
	texts[ceil(random() * array_length(texts, 1))::int],
	CASE WHEN random() < 0.5
		THEN 'sample_image_' || (ceil(random() * 5))::int || '.jpg'
		ELSE NULL
	END
FROM generate_series(1, 50),
LATERAL (
	SELECT 
		ARRAY[
			'How to Stay Productive Working from Home',
			'10 Tips for Learning Programming Fast',
			'The Future of Artificial Intelligence',
			'Travel Hacks You Need to Know',
			'Healthy Eating on a Budget',
			'What I Learned from Failing My Startup',
			'Best Books to Read in 2025',
			'Mastering Time Management',
			'Why Mindfulness Matters',
			'The Beginner’s Guide to Investing'
		] AS titles,
		ARRAY[
			'Working from home can be challenging without structure. In this post, we explore practical strategies to stay focused and productive.',
			'Learning to code does not have to be hard. Here are ten actionable tips to help you learn programming efficiently and stay motivated.',
			'Artificial intelligence is evolving rapidly. This article explores current trends and what we can expect in the near future.',
			'Traveling smart can save you time and money. Discover essential hacks that every traveler should know.',
			'Eating healthy does not have to be expensive. Here is how you can maintain a nutritious diet without breaking the bank.',
			'I failed my first startup, but learned invaluable lessons. Here is what went wrong and what I would do differently.',
			'Looking for a good read? These books will expand your thinking and entertain you throughout the year.',
			'Time management is key to success. Learn how to plan effectively and get more done with less stress.',
			'Mindfulness is not just a buzzword. It is a powerful practice that can change how you experience everyday life.',
			'New to investing? This guide will walk you through the basics to help you grow your wealth responsibly.'
		] AS texts
) AS data;