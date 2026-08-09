import { $ } from "bun";

const dbFiles = [
  "./data/app.sqlite",
  "./data/app.sqlite-shm",
  "./data/app.sqlite-wal",
];

for (const filePath of dbFiles) {
  if (await Bun.file(filePath).exists()) {
    await $`rm -f ${filePath}`;
  }
}

console.log("Reset database complete.");
