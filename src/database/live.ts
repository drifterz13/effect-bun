import { SqliteClient } from "@effect/sql-sqlite-bun";
import { Data } from "effect";

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  cause?: unknown;
  message: string;
}> {}

export const DatabaseLive = SqliteClient.layer({
  filename: "./data/app.sqlite",
});
