import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all([
    db.schema
      .createTable('user')
      .addColumn('id', 'serial', col => col.primaryKey())
      .addColumn('first_name', 'varchar', col => col.notNull())
      .addColumn('last_name', 'varchar')
      .addColumn('email', 'varchar(100)', col => col.notNull().unique())
      .addColumn('password_hash', 'char(60)', col => col.notNull()) // bcrypt hash length
      .execute(),
    db.schema
      .createTable('candidate')
      .addColumn('id', 'serial', col => col.primaryKey())
      .addColumn('first_name', 'varchar', col => col.notNull())
      .addColumn('last_name', 'varchar')
      .addColumn('email', 'varchar(100)', col => col.notNull().unique())
      .addColumn('user_id', 'integer', col => col.references('user.id').notNull())
      .execute(),
    db.schema
      .createTable('apiKeys')
      .addColumn('id', 'serial', col => col.primaryKey())
      .addColumn('key', 'char(36)', col => col.notNull()) // uuid.v4()
      .addColumn('user_id', 'integer', col => col.references('user.id').notNull())
      .execute(),
  ]);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute();
  await Promise.all([db.schema.dropTable('candidate').execute(), db.schema.dropTable('apiKeys').execute()]);
}
