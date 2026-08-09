import { Data, Result, Schema, Struct } from "effect";
import { TasklistId } from "./Tasklist";

export const ProjectId = Schema.Int.pipe(Schema.brand("ProjectId"));

export const ProjectSchema = Schema.Struct({
  id: ProjectId,
  title: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  description: Schema.optional(Schema.String.check(Schema.isMaxLength(255))),
  tasklistIds: Schema.Array(TasklistId),
});

export const UnRecordedProjectSchema = ProjectSchema.mapFields(
  Struct.pick(["title", "description"]),
);

export type Project = Schema.Schema.Type<typeof ProjectSchema>;
export type UnRecordedProject = Schema.Schema.Type<
  typeof UnRecordedProjectSchema
>;
type ProjectId = Schema.Schema.Type<typeof ProjectId>;

class InvalidProjectError extends Data.TaggedError("InvalidProjectError")<{
  message: string;
}> {}

class DuplicateTasklistError extends Data.TaggedError(
  "DuplicateTasklistError",
)<{ tasklistId: number }> {}

export type ProjectError = InvalidProjectError | DuplicateTasklistError;

export const fromRecordProject = (
  data: unknown,
): Result.Result<Project, InvalidProjectError> =>
  Schema.decodeUnknownResult(ProjectSchema)(data).pipe(
    Result.mapError(
      (error) => new InvalidProjectError({ message: error.message }),
    ),
  );

export const makeUnrecordProject = (
  data: unknown,
): Result.Result<UnRecordedProject, InvalidProjectError> =>
  Schema.decodeUnknownResult(UnRecordedProjectSchema)(data).pipe(
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
