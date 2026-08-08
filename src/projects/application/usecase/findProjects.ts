import { Effect } from "effect";
import { ProjectService } from "../service/projectService";

export const findProject = Effect.gen(function* () {
  const projectSvc = yield* ProjectService;
  const projects = yield* projectSvc.find();
  return projects;
});
