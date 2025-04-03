INSERT INTO useraccounts(first_name, last_name, email, "password") VALUES ('Test', 'Hi', 'hi.test@gmail.com', 'ajdlasjdjxaslkajdasjdksd') RETURNING *

SELECT * FROM useraccounts