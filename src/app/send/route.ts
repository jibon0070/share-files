import { NextRequest } from "next/server";
import submitAction from "./send-action";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  return Response.json(await submitAction(formData));
}
