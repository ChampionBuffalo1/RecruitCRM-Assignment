import { Pool } from 'pg';
import { Database } from './types';
import { Kysely, PostgresDialect } from 'kysely';

export let db: Kysely<Database>;

export async function connect() {
  if (db) return;
  const dialect = new PostgresDialect({
    pool: new Pool({
      max: 5,
      ssl: process.env.SSL === 'true' ? { rejectUnauthorized: true } : false,
      connectionString: process.env.PSQL_URL,
    }),
    onCreateConnection: async () => console.info('Kysely connected to database'),
  });
  db = new Kysely<Database>({ dialect });
}
