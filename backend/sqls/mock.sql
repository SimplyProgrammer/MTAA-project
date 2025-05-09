SELECT
	(random() * 2 + 1)::int,
	'The Post Title #' || gs, 
	'This is the body of post # Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Test... ' || gs,
	CASE WHEN random() < 0.5
		THEN 'test.PNG'
		ELSE NULL
	END
FROM generate_series(1, 50) AS gs;

