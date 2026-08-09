import { Data, Result, Schema } from "effect";

export const TasklistId = Schema.Int.pipe(Schema.brand("TasklistId"));
const TasklistSchema = Schema.Struct({
  id: TasklistId,
  title: Schema.String.check(
    Schema.isMinLength(1),
    Schema.isMaxLength(50),
  ),
});

export type Tasklist = Schema.Schema.Type<typeof TasklistSchema>;
export type TasklistId = Schema.Schema.Type<typeof TasklistId>;

class InvalidTasklistError extends Data.TaggedError("InvalidTasklistError")<{
  message: string;
}> {}

export type TasklistError = InvalidTasklistError;

export const makeTasklistId = (id: number) => TasklistId.make(id);
export const makeTasklist = (
  data: unknown,
): Result.Result<Tasklist, InvalidTasklistError> =>
  Schema.decodeUnknownResult(TasklistSchema)(data).pipe(
    Result.mapError(
      (error) => new InvalidTasklistError({ message: error.message }),
    ),
  );
