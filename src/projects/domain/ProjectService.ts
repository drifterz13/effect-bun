import { Context, Effect } from "effect";
import type { Project, ProjectError } from "./Project";
import type { ProjectDTO } from "../application/dto/ProjectDto";
import type { DatabaseError } from "../../database/DatabaseError";

export class ProjectService extends Context.Service<
  ProjectService,
  {
    readonly find: () => Effect.Effect<Project[], ProjectError | DatabaseError>;
    readonly create: (
      data: ProjectDTO,
    ) => Effect.Effect<Project, ProjectError | DatabaseError>;
  }
>()("@app/ProjectService") {}
