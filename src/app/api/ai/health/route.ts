import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";

  const model = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";

  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error("Ollama returned an unsuccessful response.");
    }

    const data = (await response.json()) as {
      models?: Array<{ name: string }>;
    };

    const modelInstalled =
      data.models?.some((item) => item.name === model) ?? false;

    return NextResponse.json({
      connected: true,
      model,
      modelInstalled,
      message: modelInstalled
        ? "Ollama connected. Model is ready."
        : "Ollama connected, but the configured model is not installed.",
    });
  } catch {
    return NextResponse.json(
      {
        connected: false,
        model,
        modelInstalled: false,
        message: "Cannot connect to Ollama. Open the Ollama application.",
      },
      { status: 503 },
    );
  }
}