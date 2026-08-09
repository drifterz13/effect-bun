import { Context, Effect, Layer } from "effect";
import {
  makeUnrecordProject,
  type Project,
  type ProjectError,
} from "../../domain";
import type { ProjectDTO } from "../dto/projectDto";
import { ProjectRepository } from "../../infrastructure/projectRepository";
import type { DatabaseError } from "../../../database/live";

export class ProjectService extends Context.Service<ProjectService>()(
  "app/ProjectService",
  {
    make: Effect.gen(function* () {
      const repo = yield* ProjectRepository;

      return {
        find: (): Effect.Effect<Project[], ProjectError | DatabaseError> =>
          repo.find(),

        create: (
          data: ProjectDTO,
        ): Effect.Effect<Project, ProjectError | DatabaseError> =>
          makeUnrecordProject(data).pipe(
            Effect.fromResult,
            Effect.flatMap(repo.create),
          ),
      };
    }),
  },
) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(ProjectRepository.layer),
  );
}
