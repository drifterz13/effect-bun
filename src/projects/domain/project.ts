import { Array, Data, Either, Match, pipe, Schema } from "effect";
import { TasklistId } from "./tasklist";

const ProjectId = Schema.Int.pipe(Schema.brand("ProjectId"));

const ProjectSchema = Schema.Struct({
  id: ProjectId,
  title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
  description: Schema.String.pipe(Schema.maxLength(255)),
  tasklistIds: Schema.Array(TasklistId),
});

export type Project = Schema.Schema.Type<typeof ProjectSchema>;
export type ProjectId = Schema.Schema.Type<typeof ProjectId>;

class InvalidProjectError extends Data.TaggedError("InvalidProjectError")<{
  message: string;
}> {}

class DuplicateTasklistError extends Data.TaggedError(
  "DuplicateTasklistError",
)<{ tasklistId: number }> {}

export type ProjectError = InvalidProjectError | DuplicateTasklistError;

export const makeProjectId = (id: number) => ProjectId.make(id);
export const makeProject = (
  data: unknown,
): Either.Either<Project, InvalidProjectError> =>
  pipe(
    data,
    Schema.decodeUnknownEither(ProjectSchema),
    Either.mapLeft((err) => new InvalidProjectError({ message: err.message })),
  );

export const addTasklist = (project: Project, tasklistId: TasklistId) => {
  if (project.tasklistIds.includes(tasklistId)) {
    return Either.left(new DuplicateTasklistError({ tasklistId }));
  }

  return Either.right({
    ...project,
    tasklistIds: Array.append(project.tasklistIds, tasklistId),
  });
};
