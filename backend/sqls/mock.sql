INSERT INTO Posts (user_id, title, text, image)
SELECT
	(random() * 2 + 1)::int,
	'The Post Title #' || gs, 
	'This is the body of post # Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' || gs,
	CASE WHEN random() < 0.5
		THEN 'test.PNG'
		ELSE NULL
	END
FROM generate_series(1, 50) AS gs;

