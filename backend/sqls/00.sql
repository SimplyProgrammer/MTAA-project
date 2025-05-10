-- Administrative


-- !! Hard reset rm everything
DO $$
DECLARE
	r RECORD;
BEGIN
	FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
		EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
	END LOOP;
END $$;

DO $$
DECLARE
	r RECORD;
BEGIN
	FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
		EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE';
	END LOOP;
END $$;

DO $$
DECLARE
	r RECORD;
BEGIN
	FOR r IN 
		SELECT
			n.nspname as schema_name,
			p.proname as function_name,
			pg_get_function_identity_arguments(p.oid) as args
		FROM pg_proc p
		JOIN pg_namespace n ON n.oid = p.pronamespace
		WHERE n.nspname = 'public'
	LOOP
		EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.function_name) || '(' || r.args || ') CASCADE';
	END LOOP;
END $$;

DO $$
DECLARE
	r RECORD;
BEGIN
	FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
		EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
	END LOOP;
END $$;