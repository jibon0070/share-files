"use server";

import path from "path";
import fs from "fs";
import { revalidatePath } from "next/cache";

export default async function deleteAction(
  file: string,
): Promise<{ success: true } | { success: false; message: string }> {
  const filePath = path.join(process.cwd(), "uploads", file);
  if (!fs.existsSync(filePath)) {
    return { success: false, message: "File not found" };
  }

  fs.rmSync(filePath, { force: true, recursive: true });

  revalidatePath("/");

  return { success: true };
}
