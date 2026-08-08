import { Effect, Schema } from "effect";
import { ProjectService } from "../service/projectService";
import { ProjectDTOSchema } from "../dto/projectDto";

export const createProject = (dto: unknown) =>
  Effect.gen(function* () {
    const projectSvc = yield* ProjectService;

    const data = yield* Schema.decodeUnknown(ProjectDTOSchema)(dto);
    const newProject = yield* projectSvc.create({
      title: data.title,
      description: data.description,
    });
    return newProject;
  });
