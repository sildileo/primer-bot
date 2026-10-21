import { githubFetch } from "@/lib/github/client";

export async function GET() {
  const data = await githubFetch(
    "/search/issues?q=is:issue+label:%22good+first+issue%22+language:python&per_page=2"
  );
  return Response.json(data);
}