-- Fares Uniform managed Supabase bootstrap.
--
-- The Supabase project is dedicated to Fares Uniform, so the provider-managed
-- default `postgres` database is the isolated application database for this
-- topology. Privileged bootstrap runs as the provider-managed postgres role;
-- routine Odoo runtime uses the separate least-privileged fares_app role.
--
-- No runtime password belongs in this file. fares_app is created NOLOGIN. A
-- later deployment workflow may enable LOGIN only after it can generate a
-- runtime password and inject it directly into the authorized Vercel project.

DO $bootstrap$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'fares_app') THEN
        CREATE ROLE fares_app
            NOLOGIN
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOINHERIT
            NOREPLICATION;
    END IF;
END
$bootstrap$;

-- Supabase's managed postgres role has CREATEROLE but is intentionally not a
-- true PostgreSQL superuser. Reassert only attributes it is permitted to
-- change. SUPERUSER/REPLICATION drift is checked independently and fails the
-- hosted verification closed. LOGIN state is deliberately not reasserted here
-- so an authorized runtime-activation workflow is not later undone.
ALTER ROLE fares_app
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT;

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT CONNECT, TEMPORARY ON DATABASE postgres TO fares_app;
GRANT USAGE, CREATE ON SCHEMA public TO fares_app;

-- Shared HTTP sessions are infrastructure state. Keep table ownership at the
-- privileged bootstrap boundary and grant only required DML to the app role.
CREATE TABLE IF NOT EXISTS public.fares_http_session (
    sid varchar(84) PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fares_http_session_updated_at_idx
    ON public.fares_http_session (updated_at);

ALTER TABLE public.fares_http_session OWNER TO postgres;
REVOKE ALL ON TABLE public.fares_http_session FROM PUBLIC;
REVOKE ALL ON TABLE public.fares_http_session FROM fares_app;
GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE public.fares_http_session
    TO fares_app;
