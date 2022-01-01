import * as SQLite from "expo-sqlite";
import { migration } from "./migrations";
import { executeReadTransaction } from "./tx";

describe("migration", () => {
  it("can migrate", async () => {
    const db = SQLite.openDatabase("testMigration");
    let migrations = [
      "CREATE TABLE test (id INTEGER PRIMARY KEY, text TEXT)",
      'INSERT INTO test (text, num) VALUES ("first")',
    ];
    await migration(db, migrations);

    const firstResult = await executeReadTransaction(
      db,
      "SELECT id, text FROM test"
    );
    expect(firstResult.rows.length).toBe(1);

    // Add column and set 1 as default
    migrations.push(
      "ALTER TABLE test ADD COLUMN num INTEGER",
      "UPDATE test num = 1"
    );
    await migration(db, migrations);
  });
});
