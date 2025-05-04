-- INSERT INTO useraccounts(first_name, last_name, email, "password") VALUES ('Test', 'Hi', 'hi.test@gmail.com', 'ajdlasjdjxaslkajdasjdksd') RETURNING *

SELECT * FROM useraccounts

INSERT INTO Posts (user_id, title, text, image)
SELECT
	(random() * 2 + 1)::int,
	'Post Title #' || gs, 
	'This is the body of post #' || gs,
	CASE WHEN random() < 0.5
		THEN '/files/test.PNG'
		ELSE NULL
	END
FROM generate_series(1, 50) AS gs;
