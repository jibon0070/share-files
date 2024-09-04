import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  _: NextRequest,
  { params }: { params: { fileName: string } },
) {
  const filePath = path.join(process.cwd(), "uploads", params.fileName);
  if (!fs.existsSync(filePath)) {
    return new Response(null, { status: 404 });
  }
  const file = fs.readFileSync(filePath);
  return new Response(file);
}
