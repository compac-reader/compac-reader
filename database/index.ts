import * as SQLite from "expo-sqlite";
import { executeExec } from "./tx";

export async function openDatabase() {
  const db = SQLite.openDatabase("database.db");

  await executeExec(db, "PRAGMA foreign_keys = ON;");

  db.readTransaction((tx) => {
    tx.executeSql("");
  });

  return db;
}
