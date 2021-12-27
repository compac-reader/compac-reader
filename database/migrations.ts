import * as SQLite from "expo-sqlite";
import { executeSQL, startTransaction } from "./tx";

const _migrations = [
  `
  CREATE TABLE test (id INTEGER PRIMARY KEY, text TEXT)
  `,
];

export async function migration(
  db: SQLite.WebSQLDatabase,
  migrations: string[] = _migrations
) {
  await startTransaction(db, async (tx) => {
    await executeSQL(
      tx,
      "CREATE TABLE IF NOT EXISTS _migrations (version INTEGER)"
    );
    const versionResult = await executeSQL(
      tx,
      "SELECT version FROM _migrations"
    );
    const version: number =
      versionResult.rows.length > 0
        ? versionResult.rows.item(0)["version"]
        : -1;

    for (let index = 0; index < migrations.length; index++) {
      if (version < index) {
        await executeSQL(tx, migrations[index]);
      }
    }
    await executeSQL(
      tx,
      "INSERT OR REPLACE INTO _migrations (version) VALUES (?)",
      [migrations.length - 1]
    );
  });
}
