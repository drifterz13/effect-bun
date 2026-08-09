import { Effect, Layer } from "effect";
import { ProjectService } from "../../domain/ProjectService";
import { ProjectRepository } from "../../infrastructure/ProjectRepository";
import type { ProjectDTO } from "../dto/ProjectDto";
import { makeUnrecordProject } from "../../domain";

export const ProjectServiceLive = Layer.effect(
  ProjectService,
  Effect.gen(function* () {
    const repo = yield* ProjectRepository;

    return ProjectService.of({
      find: () => repo.find(),
      create: (data: ProjectDTO) =>
        makeUnrecordProject(data).pipe(
          Effect.fromResult,
          Effect.flatMap(repo.create),
        ),
    });
  }),
);
