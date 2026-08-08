import { Data, Either, pipe, Schema } from "effect";

export const TasklistId = Schema.Int.pipe(Schema.brand("TasklistId"));
const TasklistSchema = Schema.Struct({
  id: TasklistId,
  title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(50)),
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
): Either.Either<Tasklist, InvalidTasklistError> =>
  pipe(
    data,
    Schema.decodeUnknownEither(TasklistSchema),
    Either.mapLeft((err) => new InvalidTasklistError({ message: err.message })),
  );
