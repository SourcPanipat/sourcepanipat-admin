import { drizzle } from 'drizzle-orm/libsql';
import { createClient as createLibSQLClient } from '@libsql/client';
import * as schema from './schema';

const tursoUrl = process.env.TURSO_DATABASE_URL || 'file:local-catalog.db';
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const libSqlClient = createLibSQLClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

export const db = drizzle(libSqlClient, { schema });

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}
