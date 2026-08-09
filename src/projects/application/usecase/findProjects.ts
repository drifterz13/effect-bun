import { Effect } from "effect";
import { ProjectService } from "../../domain/ProjectService";

export const FindProject = Effect.gen(function* () {
  const projectSvc = yield* ProjectService;
  const projects = yield* projectSvc.find();
  return projects;
});
