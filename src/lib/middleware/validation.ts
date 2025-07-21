import { type NextRequest, NextResponse } from "next/server"
import type { ZodSchema } from "zod"

export function withValidation(schema: ZodSchema) {
  return (handler: (req: NextRequest, validatedData: any) => Promise<NextResponse>) => async (req: NextRequest) => {
    try {
      const body = await req.json()
      const validatedData = schema.parse(body)
      return handler(req, validatedData)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: error.errors,
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
        },
        { status: 400 },
      )
    }
  }
}

export function withErrorHandling(handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args)
    } catch (error: any) {
      console.error("API Error:", error)

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Internal server error",
        },
        { status: 500 },
      )
    }
  }
}
