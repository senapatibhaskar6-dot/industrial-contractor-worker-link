import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.ts';
import { getStoredNeonUrl, saveNeonUrl, createAllTables, seedTablesIfEmpty } from './neon-manager.ts';

declare global {
  var _postgresPool: pkg.Pool | undefined;
  var _drizzleDb: any | undefined;
}

export const createPool = (customConnectionString?: string) => {
  const connectionString = 
    customConnectionString || 
    getStoredNeonUrl() || 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    process.env.NEON_DATABASE_URL;

  if (connectionString) {
    const isNeon = connectionString.includes('neon.tech');
    const newPool = new Pool({
      connectionString,
      ssl: (connectionString.includes('sslmode=require') || isNeon || connectionString.includes('ssl=true'))
        ? { rejectUnauthorized: false }
        : undefined,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    newPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });

    return newPool;
  }

  const isCloudHost = process.env.SQL_HOST && (
    process.env.SQL_HOST.includes('neon.tech') || 
    process.env.SQL_HOST.includes('aws') ||
    process.env.SQL_HOST.includes('azure') ||
    process.env.SQL_HOST.includes('cloud')
  );

  const newPool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    ssl: isCloudHost ? { rejectUnauthorized: false } : undefined,
    max: 10,
    connectionTimeoutMillis: 15000,
  });

  newPool.on('error', (err) => {
    console.error('Unexpected error on idle SQL pool client:', err);
  });

  return newPool;
};

if (!global._postgresPool) {
  global._postgresPool = createPool();
  global._drizzleDb = drizzle(global._postgresPool, { schema });
}

export const pool = global._postgresPool;
export let db = global._drizzleDb;

export async function getDatabaseStatus() {
  const currentPool = global._postgresPool || pool;
  try {
    const client = await currentPool.connect();
    try {
      const dbInfoRes = await client.query('SELECT current_database(), inet_server_addr()');
      const dbName = dbInfoRes.rows[0]?.current_database || 'cloud_sql_development_database';
      
      const storedUrl = getStoredNeonUrl();
      const isNeon = !!(storedUrl && storedUrl.includes('neon.tech'));
      const sanitizedHost = storedUrl ? storedUrl.split('@')[1]?.split('/')[0] : (process.env.SQL_HOST || 'internal-sql-host');

      // Check counts of key tables
      const counts: Record<string, number> = {};
      const tablesToCheck = ['industries', 'contractors', 'workers', 'attendance', 'bills', 'supervisors'];
      for (const t of tablesToCheck) {
        try {
          const res = await client.query(`SELECT COUNT(*) FROM ${t}`);
          counts[t] = parseInt(res.rows[0].count, 10);
        } catch {
          counts[t] = 0;
        }
      }

      return {
        connected: true,
        isNeon,
        databaseType: isNeon ? 'Neon PostgreSQL (Cloud Serverless)' : 'Cloud SQL PostgreSQL (Internal Engine)',
        databaseName: dbName,
        host: sanitizedHost,
        tables: counts,
        totalRecords: Object.values(counts).reduce((a, b) => a + b, 0),
        timestamp: new Date().toISOString()
      };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return {
      connected: false,
      isNeon: false,
      databaseType: 'Disconnected',
      error: err.message || 'Connection failed',
      tables: {},
      totalRecords: 0,
      timestamp: new Date().toISOString()
    };
  }
}

export async function reconnectDatabase(newConnectionString: string) {
  if (!newConnectionString || !newConnectionString.trim()) {
    throw new Error('Connection string cannot be empty');
  }

  const cleanUrl = newConnectionString.trim();
  const testPool = new Pool({
    connectionString: cleanUrl,
    ssl: (cleanUrl.includes('sslmode=require') || cleanUrl.includes('neon.tech') || cleanUrl.includes('ssl=true'))
      ? { rejectUnauthorized: false }
      : undefined,
    max: 5,
    connectionTimeoutMillis: 15000,
  });

  const client = await testPool.connect();
  try {
    // 1. Verify connection
    await client.query('SELECT 1');

    // 2. Automatically create all 17 tables in Neon if not exists
    await createAllTables(client);

    // 3. Seed tables if empty
    await seedTablesIfEmpty(client);

    // 4. Save to config file so it persists
    saveNeonUrl(cleanUrl);

    // 5. Close old pool if running
    if (global._postgresPool) {
      global._postgresPool.end().catch(() => {});
    }

    // 6. Replace global pool & drizzle instance
    global._postgresPool = testPool;
    global._drizzleDb = drizzle(testPool, { schema });
    db = global._drizzleDb;

    return await getDatabaseStatus();
  } catch (err) {
    await testPool.end().catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
