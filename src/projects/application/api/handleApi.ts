import { Effect, Match, Schema } from "effect";
import type { ProjectError, TasklistError } from "../../domain";
import type { DatabaseError } from "../../../database/live";

export type ApiResponse<T> =
  | { status: number; data: T }
  | { status: number; error: string; details?: unknown };

export type ProjectApplicationError =
  | Schema.SchemaError
  | ProjectError
  | TasklistError
  | DatabaseError;

const toProjectError = Match.type<ProjectApplicationError>().pipe(
  Match.tagsExhaustive({
    SchemaError: (error) => ({
      status: 400,
      error: "Invalid request",
      details: error.message,
    }),
    InvalidProjectError: (error) => ({
      status: 400,
      error: error.message,
    }),
    InvalidTasklistError: (error) => ({
      status: 400,
      error: error.message,
    }),
    DuplicateTasklistError: (error) => ({
      status: 400,
      error: error.message,
    }),
    DatabaseError: (error) => ({
      status: 500,
      error: "Database error",
      details: error.message,
    }),
  }),
);

export const handleApi = <A, R>(
  effect: Effect.Effect<A, ProjectApplicationError, R>,
  successStatus = 200,
): Effect.Effect<ApiResponse<A>, never, R> =>
  effect.pipe(
    Effect.map((data) => ({ status: successStatus, data })),
    Effect.catch((error) => Effect.succeed(toProjectError(error))),
    Effect.catchDefect((defect) =>
      Effect.succeed({
        status: 500,
        error: "Internal Server Error",
        details: String(defect),
      }),
    ),
  );
