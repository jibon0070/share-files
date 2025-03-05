"use server";

import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs";

export default async function deleteAllAction(): Promise<
  { success: true } | { success: false; message: string }
> {
  const folderPath = path.join(process.cwd(), "storage", "uploads");

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    fs.rmSync(path.join(folderPath, file));
  }

  revalidatePath("/");
  return { success: true };
}
