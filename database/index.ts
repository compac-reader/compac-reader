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
  lastReadPageRate?: string;
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
      isRead: item.isRead,
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

export type Episode = {
  id: string;
  storyId: string;
  episodeId?: string;
  type: "header" | "episode";
  title: string;
  index: number;
  publishedAt?: number;
  revisedAt?: number;
  isRead: boolean;
  downloadedAt?: number;
};

export async function insertEpisode(episode: Episode) {
  const db = await openDatabase();

  await executeWriteTransaction(
    db,
    "INSERT OR REPLACE INTO episodes (id, storyId, episodeId, type, title, number, publishedAt, revisedAt, isRead, downloadedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      episode.id,
      episode.storyId,
      episode.episodeId || "",
      episode.type,
      episode.title,
      episode.index,
      episode.publishedAt || 0,
      episode.revisedAt || 0,
      episode.isRead ? 1 : 0,
      episode.downloadedAt || 0,
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
