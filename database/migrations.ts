import * as SQLite from "expo-sqlite";
import { executeReadTransaction, executeWriteTransaction } from "./tx";

const _migrations = [
  `
  CREATE TABLE stories (
    id TEXT NOT NULL PRIMARY KEY,
    publisherType TEXT NOT NULL,
    publisherCode TEXT NOT NULL,
    title TEXT NOT NULL,
    authorName TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    lastUpdatedAt INTEGER NOT NULL,
    lastReadEpisodeId TEXT NOT NULL,
    lastReadPageRate REAL NOT NULL,
    UNIQUE(publisherType, publisherCode)
  );
  `,
  `
  CREATE TABLE episodes (
    id TEXT NOT NULL PRIMARY KEY,
    storyId TEXT NOT NULL,
    episodeId TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    number INTEGER NOT NULL,
    publishedAt INTEGER NOT NULL,
    revisedAt INTEGER NOT NULL,
    isRead BOOLEAN NOT NULL,
    downloadedAt INTEGER NOT NULL,
    FOREIGN KEY(storyId) REFERENCES stories(id),
    UNIQUE(storyId, episodeId)
  );
  `,
  `
  CREATE TABLE viewer_configurations (
    id TEXT NOT NULL PRIMARY KEY,
    value INTEGER NOT NULL
  );
  `,
];

export async function migration(
  db: SQLite.WebSQLDatabase,
  migrations: string[] = _migrations
) {
  await executeWriteTransaction(
    db,
    "CREATE TABLE IF NOT EXISTS _migrations (id INTEGER PRIMARY KEY, version INTEGER)"
  );
  const versionResult = await executeReadTransaction(
    db,
    "SELECT version FROM _migrations;"
  );
  const version: number =
    versionResult.rows.length > 0 ? versionResult.rows.item(0)["version"] : -1;
  for (let index = 0; index < migrations.length; index++) {
    if (version < index) {
      await executeWriteTransaction(db, migrations[index]);
    }
  }
  // TODO: handling in case of error occurred
  await executeWriteTransaction(
    db,
    "INSERT OR REPLACE INTO _migrations (id, version) VALUES (1, ?)",
    [migrations.length - 1]
  );
}
