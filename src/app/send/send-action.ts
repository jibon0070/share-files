"use server";

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs";

export default async function submitAction(
  data: FormData,
): Promise<{ success: true } | { success: false; message: string }> {
  if (!existsSync(path.join(process.cwd(), "uploads"))) {
    mkdirSync(path.join(process.cwd(), "uploads"));
  }

  // @ts-ignore
  for (const f of [...data.values()]) {
    const file = f as unknown as File;
    await handleFile(file);
  }

  revalidatePath("/");

  return {
    success: true,
  };
}

async function handleFile(file: File, increament?: number) {
  let fileName = file.name;
  if (increament) {
    fileName = `${path.parse(fileName).name} (${increament})${path.parse(fileName).ext}`;
  }

  const filePath = path.join(process.cwd(), "uploads", fileName);

  if (fs.existsSync(filePath)) {
    return await handleFile(file, increament ? increament + 1 : 1);
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  writeFileSync(filePath, buffer);
}
