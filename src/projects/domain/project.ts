import { Data, Result, Schema } from "effect";
import { TasklistId } from "./tasklist";

const ProjectId = Schema.Int.pipe(Schema.brand("ProjectId"));

const ProjectSchema = Schema.Struct({
  id: ProjectId,
  title: Schema.String.check(
    Schema.isMinLength(1),
    Schema.isMaxLength(100),
  ),
  description: Schema.String.check(Schema.isMaxLength(255)),
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
): Result.Result<Project, InvalidProjectError> =>
  Schema.decodeUnknownResult(ProjectSchema)(data).pipe(
    Result.mapError(
      (error) => new InvalidProjectError({ message: error.message }),
    ),
  );

export const addTasklist = (project: Project, tasklistId: TasklistId) => {
  if (project.tasklistIds.includes(tasklistId)) {
    return Result.fail(new DuplicateTasklistError({ tasklistId }));
  }

  return Result.succeed({
    ...project,
    tasklistIds: [...project.tasklistIds, tasklistId],
  });
};
