import { ManagedRuntime } from "effect";
import { ProjectService } from "./projects/application/service/projectService";
import * as projectProgram from "./projects/application/usecase";
import { handleApi } from "./projects/application/api/handleApi";

const appRuntime = ManagedRuntime.make(ProjectService.layer);

const server = Bun.serve({
  port: Number(Bun.env.PORT ?? 4000),
  routes: {
    "/": () => new Response("Hello world"),
    "/projects": async (req: Request) => {
      if (req.method === "GET") {
        const resp = await appRuntime.runPromise(
          handleApi(projectProgram.findProject),
        );
        return Response.json(resp, { status: resp.status });
      }
      if (req.method === "POST") {
        const body = await req.json();
        const resp = await appRuntime.runPromise(
          handleApi(projectProgram.createProject(body)),
        );
        return Response.json(resp, { status: resp.status });
      }

      return Response.json({ details: "Method not allowed" }, { status: 405 });
    },
  },
});

console.log(`Server is running on: ${server.url}`);
