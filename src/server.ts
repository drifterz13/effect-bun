import { Layer, ManagedRuntime } from "effect";
import * as projectProgram from "./projects/application/usecase";
import { handleApi } from "./projects/application/api/handleApi";
import { ProjectServiceLive } from "./projects/application/service/ProjectService.Live";
import { ProjectRepository } from "./projects/infrastructure/ProjectRepository";

const RepositoryLive = Layer.mergeAll(ProjectRepository.Live);
const AppLive = Layer.mergeAll(ProjectServiceLive).pipe(
  Layer.provide(RepositoryLive),
);

const appRuntime = ManagedRuntime.make(AppLive);

const server = Bun.serve({
  port: Number(Bun.env.PORT ?? 4000),
  routes: {
    "/": () => new Response("Hello world"),
    "/projects": async (req: Request) => {
      if (req.method === "GET") {
        const resp = await appRuntime.runPromise(
          handleApi(projectProgram.FindProject),
        );
        return Response.json(resp, { status: resp.status });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const resp = await appRuntime.runPromise(
          handleApi(projectProgram.CreateProject(body)),
        );
        return Response.json(resp, { status: resp.status });
      }

      return Response.json({ details: "Method not allowed" }, { status: 405 });
    },
  },
});

console.log(`Server is running on: ${server.url}`);
