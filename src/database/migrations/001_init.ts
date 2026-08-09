import { Effect } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

export default Effect.gen(function* () {
  const sql = yield* SqlClient;

  yield* sql`
    CREATE TABLE projects (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE TABLE tasklists (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      project_id INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    )
  `;
});
