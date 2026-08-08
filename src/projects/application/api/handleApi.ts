import { Cause, Effect, Match, Option, ParseResult } from "effect";
import type { ProjectError, TasklistError } from "../../domain";

export type ApiResponse<T> =
  | { status: number; data: T }
  | { status: number; error: string; details?: unknown };

export type ProjectApplicationError =
  | ParseResult.ParseError
  | ProjectError
  | TasklistError;

const toProjectError = Match.type<ProjectApplicationError>().pipe(
  Match.tagsExhaustive({
    ParseError: (error) => {
      const issues = ParseResult.ArrayFormatter.formatErrorSync(error);
      return {
        status: 400,
        error: "Invalid request",
        details: issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue._tag,
        })),
      };
    },
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
  }),
);

export const handleApi = <A, R>(
  effect: Effect.Effect<A, ProjectApplicationError, R>,
  successStatus = 200,
): Effect.Effect<ApiResponse<A>, never, R> =>
  effect.pipe(
    Effect.map((data) => ({ status: successStatus, data })),
    Effect.catchAllCause((cause) =>
      Option.match(Cause.failureOption(cause), {
        onSome: (error) => Effect.succeed(toProjectError(error)),
        onNone: () =>
          Effect.succeed({
            status: 500,
            error: "Internal Server Error",
          }),
      }),
    ),
  );
