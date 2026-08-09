import { Schema } from "effect";

export const TasklistDtoSchema = Schema.Struct({
  title: Schema.String,
  projectId: Schema.Int,
});

export type TasklistDto = Schema.Schema.Type<typeof TasklistDtoSchema>;
