import { Effect, HashMap, Random, Ref } from "effect";
import {
  makeProject,
  makeProjectId,
  type Project,
  type ProjectError,
  type ProjectId,
} from "../../domain";
import type { ProjectDTO } from "../dto/projectDto";

export class ProjectService extends Effect.Service<ProjectService>()(
  "app/ProjectService",
  {
    effect: Effect.gen(function* () {
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

            const project = yield* makeProject({
              id: projectId,
              title: data.title,
              description: data.description,
              tasklistIds: [],
            });
            yield* Ref.update(projects, (ref) =>
              HashMap.set(ref, projectId, project),
            );

            return project;
          }),
      };
    }),
    dependencies: [],
  },
) {}
