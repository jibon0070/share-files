"use server";

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { revalidatePath } from "next/cache";
import { join } from "path";

export default async function submitAction(
  data: FormData,
): Promise<{ success: true } | { success: false; message: string }> {
  if (!existsSync(join(process.cwd(), "uploads"))) {
    mkdirSync(join(process.cwd(), "uploads"));
  }

  // @ts-ignore
  for (const f of [...data.values()]) {
    const file = f as unknown as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    writeFileSync(join(process.cwd(), "uploads", file.name), buffer);
  }

  revalidatePath("/");

  return {
    success: true,
  };
}
