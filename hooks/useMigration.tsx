import React, { useEffect } from "react";
import { migration } from "../database/migrations";
import { openDatabase } from "../database";

export function useMigration() {
  const [isMigrating, setIsMigrating] = React.useState(true);
  useEffect(() => {
    (async () => {
      try {
        const db = await openDatabase();
        await migration(db);
        setIsMigrating(false);
      } catch (error) {
        console.error(error);
        setIsMigrating(false);
      }
    })();
  }, []);
  return {
    isMigrating: isMigrating,
  };
}
