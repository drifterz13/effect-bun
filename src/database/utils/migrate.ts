import { SqliteMigrator } from "@effect/sql-sqlite-bun";
import { Effect } from "effect";
import migration001 from "../migrations/001_init";
import { DatabaseLive } from "../Database.Live";

const migrations = SqliteMigrator.fromRecord({
  "001_init": migration001,
});

const migrate = SqliteMigrator.run({
  loader: migrations,
});

const applied = await Effect.runPromise(
  migrate.pipe(Effect.provide(DatabaseLive)),
);

if (applied.length > 0) {
  console.log(
    `Applied migrations: ${applied.map(([id, name]) => `${id}_${name}`).join(", ")}`,
  );
} else {
  console.log("Database is up to date");
}
