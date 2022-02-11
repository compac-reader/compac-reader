import * as SQLite from "expo-sqlite";
import {
  executeExec,
  executeReadTransaction,
  executeWriteTransaction,
} from "./tx";
import * as FileSystem from "expo-file-system";

const dbname = "db.sqlite";
export async function dangerousResetDatabase() {
  const file = `${FileSystem.documentDirectory}/SQLite/${dbname}`;
  await FileSystem.deleteAsync(file);
}

export async function openDatabase() {
  const db = SQLite.openDatabase(dbname);

  await executeExec(db, "PRAGMA foreign_keys = ON;");

  return db;
}

export type Story = {
  id: string;
  publisherType: "narou";
  publisherCode: string;
  title: string;
  authorName: string;
  description: string;
  icon?: string;
  lastUpdatedAt: number;
  lastReadEpisodeId?: string;
  lastReadPageRate?: number;
};

export type Episode =
  | {
      id: string;
      storyId: string;
      type: "episode";
      episodeId: string;
      title: string;
      publishedAt: number;
      revisedAt: number;
      index: number;
      isRead: boolean;
      downloadedAt?: number;
    }
  | {
      id: string;
      storyId: string;
      type: "header";
      title: string;
      index: number;
    };

export async function queryStories(): Promise<Story[]> {
  const db = await openDatabase();

  let results: Story[] = [];
  const stories = await executeReadTransaction(
    db,
    "SELECT * FROM stories ORDER BY lastUpdatedAt DESC;"
  );
  for (let i = 0; i < stories.rows.length; i++) {
    const item = stories.rows.item(i);
    results.push({
      id: item.id,
      publisherType: item.publisherType,
      publisherCode: item.publisherCode,
      title: item.title,
      authorName: item.authorName,
      description: item.description,
      icon: item.icon,
      lastUpdatedAt: item.lastUpdatedAt,
      lastReadEpisodeId: item.lastReadEpisodeId,
      lastReadPageRate: item.lastReadPageRate,
    });
  }
  return results;
}

export async function queryStory(
  id: string
): Promise<(Story & { episodes: Episode[] }) | null> {
  const db = await openDatabase();

  const story = await executeReadTransaction(
    db,
    "SELECT * FROM stories WHERE id = ?;",
    [id]
  );
  if (story.rows.length === 0) {
    return null;
  }
  const episodes = await executeReadTransaction(
    db,
    "SELECT id, storyId, episodeId, type, title, number, publishedAt, revisedAt, isRead, downloadedAt FROM episodes WHERE storyId = ? ORDER BY number ASC;",
    [id]
  );
  let episodeResults: Episode[] = [];
  for (let i = 0; i < episodes.rows.length; i++) {
    const item = episodes.rows.item(i);
    episodeResults.push({
      id: item.id,
      storyId: item.storyId,
      episodeId: item.type === "episode" ? item.episodeId : undefined,
      type: item.type,
      title: item.title,
      index: item.number,
      publishedAt: item.publishedAt || undefined,
      revisedAt: item.revisedAt || undefined,
      isRead: !!item.isRead,
      downloadedAt: item.downloadedAt || undefined,
    });
  }

  const item = story.rows.item(0);
  return {
    id: item.id,
    publisherType: item.publisherType,
    publisherCode: item.publisherCode,
    title: item.title,
    authorName: item.authorName,
    description: item.description,
    icon: item.icon || undefined,
    lastUpdatedAt: item.lastUpdatedAt,
    lastReadEpisodeId: item.lastReadEpisodeId || undefined,
    lastReadPageRate: item.lastReadPageRate || undefined,
    episodes: episodeResults,
  };
}

export async function queryEpisode(
  id: string
): Promise<(Episode & { body?: string }) | null> {
  const db = await openDatabase();

  const episode = await executeReadTransaction(
    db,
    "SELECT * FROM episodes WHERE id = ?;",
    [id]
  );
  if (episode.rows.length === 0) {
    return null;
  }
  const item = episode.rows.item(0);
  return {
    id: item.id,
    storyId: item.storyId,
    episodeId: item.episodeId,
    type: item.type,
    title: item.title,
    body: item.body || undefined,
    index: item.number,
    publishedAt: item.publishedAt,
    revisedAt: item.revisedAt || undefined,
    isRead: item.isRead,
    downloadedAt: item.downloadedAt || undefined,
  };
}

export async function insertStory(story: Story) {
  const db = await openDatabase();
  await executeWriteTransaction(
    db,
    "INSERT OR REPLACE INTO stories (id, publisherType, publisherCode, title, authorName, description, icon, lastUpdatedAt, lastReadEpisodeId, lastReadPageRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      story.id,
      story.publisherType,
      story.publisherCode,
      story.title,
      story.authorName,
      story.description,
      story.icon || "",
      story.lastUpdatedAt,
      story.lastReadEpisodeId || "",
      story.lastReadPageRate || 0,
    ]
  );
}

export async function deleteStory(storyId: string) {
  const db = await openDatabase();
  await executeWriteTransaction(db, "DELETE FROM episodes WHERE storyId = ?;", [
    storyId,
  ]);
  await executeWriteTransaction(db, "DELETE FROM stories WHERE id = ?;", [
    storyId,
  ]);
}

export async function insertEpisode(episode: Episode) {
  const db = await openDatabase();

  await executeWriteTransaction(
    db,
    "INSERT OR REPLACE INTO episodes (id, storyId, episodeId, type, title, number, publishedAt, revisedAt, isRead, downloadedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      episode.id,
      episode.storyId,
      episode.type === "episode" ? episode.episodeId || "" : "",
      episode.type,
      episode.title,
      episode.index,
      episode.type === "episode" ? episode.publishedAt || 0 : 0,
      episode.type === "episode" ? episode.revisedAt || 0 : 0,
      episode.type === "episode" ? (episode.isRead ? 1 : 0) : 0,
      episode.type === "episode" ? episode.downloadedAt || 0 : 0,
    ]
  );
}

export async function addBodyToEpisode(id: string, body: string) {
  const db = await openDatabase();

  await executeWriteTransaction(
    db,
    "UPDATE episodes SET body = ?, downloadedAt = ? WHERE id = ?;",
    [body, Math.floor(Date.now() / 1000), id]
  );
}

export async function readEpisode(
  storyId: string,
  episodeId: string,
  pageRate?: number
) {
  const db = await openDatabase();
  await executeWriteTransaction(
    db,
    "UPDATE episodes SET isRead = ? WHERE id = ?;",
    [1, databaseEpisodeId(storyId, episodeId)]
  );
  if (pageRate) {
    await executeWriteTransaction(
      db,
      "UPDATE stories SET lastReadEpisodeId = ?, lastReadPageRate = ? WHERE id = ?;",
      [episodeId, pageRate, storyId]
    );
  } else {
    await executeWriteTransaction(
      db,
      "UPDATE stories SET lastReadEpisodeId = ? WHERE id = ?;",
      [episodeId, storyId]
    );
  }
}

export function databaseEpisodeId(storyId: string, episodeId: string) {
  if (episodeId) {
    return `${storyId}__${episodeId}`;
  } else {
    return `${storyId}__0`;
  }
}

export async function queryViewerConfiguration() {
  const db = await openDatabase();

  const configurationValues = await executeReadTransaction(
    db,
    "SELECT * FROM viewer_configurations;"
  );

  const configurations = new Map<string, number>();

  for (let i = 0; i < configurationValues.rows.length; ++i) {
    const item = configurationValues.rows.item(i);
    const {id, value}: { id: string, value: number } = item;
    configurations.set(id, value);
  }

  return configurations;
}

export async function insertViewerConfiguration(configurations: Map<string, number>) {
  const db = await openDatabase();

  for (let [id, value] of configurations) {
    await executeWriteTransaction(
      db,
      "INSERT OR REPLACE INTO viewer_configurations (id, value) VALUES (?, ?);",
      [id, value]
    );
  }
}
