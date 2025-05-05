

-- ALL INSERTS ARE FOR USER_ID = 1 (the first user in the database)

-- 1) Subjects
INSERT INTO Subjects (title, description) VALUES
  ('Mathematics', 'Calculus and linear algebra fundamentals'),
  ('Physics', 'Mechanics and electromagnetism'),
  ('Computer Science', 'Data structures and algorithms'),
  ('History', 'Modern world history'),
  ('Literature', 'English literature analysis');

-- 2) Enroll user 1 in all subjects
INSERT INTO User_Subjects (user_id, subject_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5);

-- 3) Lectures (one per subject, weekly; all in the week of 2025-05-05, no overlaps)
INSERT INTO Lectures (subject_id, from_time, to_time, day) VALUES
  (1, '2025-05-05 09:00:00', '2025-05-05 10:30:00', 'Monday'),
  (2, '2025-05-06 11:00:00', '2025-05-06 12:30:00', 'Tuesday'),
  (3, '2025-05-07 13:00:00', '2025-05-07 14:30:00', 'Wednesday'),
  (4, '2025-05-08 15:00:00', '2025-05-08 16:30:00', 'Thursday'),
  (5, '2025-05-09 17:00:00', '2025-05-09 18:30:00', 'Friday');

-- 4) Assign user 1 to each lecture
INSERT INTO User_Lectures (user_id, lecture_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5);

-- 5) Seminars (one per subject; times don’t collide with lectures)
INSERT INTO Seminars (subject_id, from_time, to_time, day) VALUES
  (1, '2025-05-07 11:00:00', '2025-05-07 12:30:00', 'Wednesday'),
  (2, '2025-05-08 09:00:00', '2025-05-08 10:30:00', 'Thursday'),
  (3, '2025-05-09 11:00:00', '2025-05-09 12:30:00', 'Friday'),
  (4, '2025-05-05 14:00:00', '2025-05-05 15:30:00', 'Monday'),
  (5, '2025-05-06 15:00:00', '2025-05-06 16:30:00', 'Tuesday');

-- 6) Assign user 1 to each seminar
INSERT INTO User_Seminars (user_id, seminar_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5);

-- 7) Events (two per subject: one assignment, one exam)
INSERT INTO Events (subject_id, title, type, date_till) VALUES
  (1, 'Limits Worksheet',        'assignment', '2025-05-12 23:59:00'),
  (1, 'Calculus Midterm',        'exam',       '2025-06-05 09:00:00'),
  (2, 'Mechanics Lab Report',    'assignment', '2025-05-19 23:59:00'),
  (2, 'Physics Midterm',         'exam',       '2025-06-10 10:00:00'),
  (3, 'Algorithm Design',        'assignment', '2025-05-26 23:59:00'),
  (3, 'Data Structures Exam',    'exam',       '2025-06-15 09:00:00'),
  (4, 'Essay on World War I',    'assignment', '2025-05-15 23:59:00'),
  (4, 'History Midterm',         'exam',       '2025-06-08 14:00:00'),
  (5, 'Poetry Analysis',         'assignment', '2025-05-22 23:59:00'),
  (5, 'Literature Final Exam',   'exam',       '2025-06-20 13:00:00');

-- 8) Assign all events to user 1
INSERT INTO User_Events (user_id, event_id) VALUES
  (1, 1), (1, 2),
  (1, 3), (1, 4),
  (1, 5), (1, 6),
  (1, 7), (1, 8),
  (1, 9), (1, 10);

INSERT INTO Evaluations (user_id, subject_id, title, points, max_points) VALUES
  -- Mathematics (subject_id = 1)
  (1, 1, 'Calculus Midterm',        87, 100),
  (1, 1, 'Linear Algebra Final',    92, 100),

  -- Physics (subject_id = 2)
  (1, 2, 'Mechanics Quiz',          15,  20),
  (1, 2, 'Electromagnetism Final',  88, 100),

  -- Computer Science (subject_id = 3)
  (1, 3, 'Data Structures Midterm', 78, 100),
  (1, 3, 'Algorithms Final',        81, 100),

  -- History (subject_id = 4)
  (1, 4, 'World History Essay',     45,  50),
  (1, 4, 'Modern History Exam',     90, 100),

  -- Literature (subject_id = 5)
  (1, 5, 'Poetry Analysis',         19,  20),
  (1, 5, 'Shakespeare Final',       94, 100);