import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Diagnostic endpoint is only available during development.
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not found." },
      { status: 404 },
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      connected: true,
      message: "PostgreSQL connected successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        connected: false,
        message: "Database connection failed. Check local configuration.",
      },
      { status: 503 },
    );
  }
}