import {
  streamText,
  UIMessage,
  convertToModelMessages,
  isStepCount,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { buscarIssues } from "@/lib/tools/buscarIssues";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5.4-mini"),
    system:
      "Sos PRimer, un asistente que ayuda a estudiantes y devs junior a encontrar " +
      "su primera contribución open source. Respondé en español.",
    messages: await convertToModelMessages(messages),
    tools: { buscarIssues },
    stopWhen: isStepCount(5),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}