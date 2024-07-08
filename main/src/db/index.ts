import { Pool } from 'pg';
import path from 'node:path';
import fs from 'node:fs/promises';
import { Database } from './types';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';

export let db: Kysely<Database>;

async function connect() {
  if (db) return;
  console.log(process.env.PSQL_URL, process.env.SSL);
  
  const dialect = new PostgresDialect({
    pool: new Pool({
      max: 5,
      ssl: process.env.SSL === 'true' ? { rejectUnauthorized: true } : false,
      connectionString: process.env.PSQL_URL,
    }),
    onCreateConnection: async () => {
      console.info('Kysely connected to database');
    },
  });
  db = new Kysely<Database>({
    dialect,
    // log(event): void {
    //   if (!isProd && event.level === 'query') {
    //     console.debug(`SQL: ${event.query.sql}`);
    //     if (event.query.parameters.length > 0) console.debug(`SQL Parameters: ${event.query.parameters}`);
    //   }
    // }
  });
}

async function migrateToLatest() {
  if (!db) throw new Error('Database not connected!');
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.resolve(__dirname, './migration'),
    }),
  });
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

export async function connectAndMigrate(): Promise<void> {
  try {
    await connect();
    migrateToLatest();
  } catch (err) {
    console.error('Failed to properly connect to the database: ' + err);
    process.exit(1);
  }
}
