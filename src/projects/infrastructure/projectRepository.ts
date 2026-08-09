import { SqliteClient } from "@effect/sql-sqlite-bun";
import { Array, Context, Effect, Layer, Option } from "effect";
import { DatabaseLive } from "../../database/Database.Live";
import { fromRecordProject, type UnRecordedProject } from "../domain";
import { DatabaseError } from "../../database/DatabaseError";

type ProjectRow = {
  readonly id: number;
  readonly title: string;
  readonly description: string;
};

export class ProjectRepository extends Context.Service<ProjectRepository>()(
  "infra/ProjectRepository",
  {
    make: Effect.gen(function* () {
      const sql = yield* SqliteClient.SqliteClient;
      return {
        find: () =>
          sql<ProjectRow>`
            SELECT id, title, description
            FROM projects
            ORDER BY id
          `.pipe(
            Effect.mapError(
              (error) =>
                new DatabaseError({
                  message: "Load projects error",
                  cause: error,
                }),
            ),
            Effect.flatMap((rows) => Effect.forEach(rows, toProject)),
          ),

        create: (data: UnRecordedProject) =>
          sql<ProjectRow>`
            INSERT INTO projects (title, description)
            VALUES (${data.title}, ${data.description})
            RETURNING id, title, description
          `.pipe(
            Effect.mapError(
              (error) =>
                new DatabaseError({
                  message: "Create project failed",
                  cause: error,
                }),
            ),
            Effect.flatMap((rows) =>
              Option.match(Array.head(rows), {
                onNone: () =>
                  Effect.fail(
                    new DatabaseError({
                      message: "Insert returned no project",
                    }),
                  ),
                onSome: Effect.succeed,
              }),
            ),
            Effect.flatMap(toProject),
          ),
      };
    }),
  },
) {
  static readonly Live = Layer.effect(this, this.make).pipe(
    Layer.provide(DatabaseLive),
  );
}

export const toProject = (row: ProjectRow) =>
  Effect.fromResult(
    fromRecordProject({
      id: row.id,
      title: row.title,
      description: row.description,
      tasklistIds: [],
    }),
  );
