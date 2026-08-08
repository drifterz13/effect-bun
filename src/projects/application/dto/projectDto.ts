import { Schema } from "effect";

export const ProjectDTOSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
});

export type ProjectDTO = Schema.Schema.Type<typeof ProjectDTOSchema>;
