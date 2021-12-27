import * as SQLite from "expo-sqlite";

export function executeExec(db: SQLite.WebSQLDatabase, sql: string) {
  return new Promise<void>((resolve) => {
    db.exec([{ sql: sql, args: [] }], false, () => resolve());
  });
}

export function executeSQL(
  tx: SQLite.SQLTransaction,
  sqlStatement: string,
  args?: (number | string)[]
) {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    tx.executeSql(
      sqlStatement,
      args,
      (_, result) => {
        resolve(result);
      },
      (_, error) => {
        reject(error);
        return true;
      }
    );
  });
}

export function executeReadTransaction(
  db: SQLite.WebSQLDatabase,
  sqlStatement: string,
  args?: (number | string)[]
) {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.readTransaction((tx) => {
      executeSQL(tx, sqlStatement, args)
        .then((result) => resolve(result))
        .catch((reason) => reject(reason));
    });
  });
}

export function executeWriteTransaction(
  db: SQLite.WebSQLDatabase,
  sqlStatement: string,
  args?: (number | string)[]
) {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      executeSQL(tx, sqlStatement, args)
        .then((result) => resolve(result))
        .catch((reason) => reject(reason));
    });
  });
}

export async function startTransaction(
  db: SQLite.WebSQLDatabase,
  fn: (tx: SQLite.SQLTransaction) => Promise<void>
) {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      fn(tx)
        .then(() => resolve())
        .catch((reason) => reject(reason));
    });
  });
}
