import { Effect, Schema } from "effect";
import { ProjectService } from "../../domain/ProjectService";
import { ProjectDTOSchema } from "../dto/ProjectDto";

export const CreateProject = (dto: unknown) =>
  Effect.gen(function* () {
    const projectSvc = yield* ProjectService;

    const data = yield* Schema.decodeUnknownEffect(ProjectDTOSchema)(dto);
    const newProject = yield* projectSvc.create({
      title: data.title,
      description: data.description,
    });
    return newProject;
  });
