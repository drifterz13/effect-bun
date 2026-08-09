import { Context, Effect, HashMap, Layer, Random, Ref } from "effect";
import {
  makeProject,
  makeProjectId,
  type Project,
  type ProjectError,
  type ProjectId,
} from "../../domain";
import type { ProjectDTO } from "../dto/projectDto";

export class ProjectService extends Context.Service<ProjectService>()(
  "app/ProjectService",
  {
    make: Effect.gen(function* () {
      const projects = yield* Ref.make(HashMap.empty<ProjectId, Project>());

      return {
        find: (): Effect.Effect<Project[], never> =>
          Ref.get(projects).pipe(
            Effect.map((ref) => Array.from(HashMap.values(ref))),
          ),
        create: (data: ProjectDTO): Effect.Effect<Project, ProjectError> =>
          Effect.gen(function* () {
            const rawId = yield* Random.nextIntBetween(1, 100);
            const projectId = makeProjectId(rawId);

            const project = yield* Effect.fromResult(
              makeProject({
                id: projectId,
                title: data.title,
                description: data.description,
                tasklistIds: [],
              }),
            );
            yield* Ref.update(projects, (ref) =>
              HashMap.set(ref, projectId, project),
            );

            return project;
          }),
      };
    }),
  },
) {
  static readonly layer = Layer.effect(this, this.make);
}
