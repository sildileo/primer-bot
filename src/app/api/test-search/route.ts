import { githubFetch } from "@/lib/github/client";
import { searchIssues } from "@/lib/github/searchIssues";

export async function GET() {
  const data = await searchIssues({ lenguaje: "python", tema: "api" })
  return Response.json(data);
}