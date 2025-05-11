INSERT INTO Posts (user_id, title, text, image) -- Mock posts
SELECT
	(random() * 2 + 1)::int,
	titles[ceil(random() * array_length(titles, 1))::int],
	texts[ceil(random() * array_length(texts, 1))::int],
	CASE WHEN random() < 0.5
		THEN 'test.PNG'
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

