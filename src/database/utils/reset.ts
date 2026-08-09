import { $ } from "bun";
import { readdir } from "node:fs/promises";

const dbPath = "./data";
const dbFiles = await readdir(dbPath);
for (const file of dbFiles) {
  const filePath = `${dbPath}/${file}`;
  await $`rm -f ${filePath}`;
}
console.log("Reset database complete.");
