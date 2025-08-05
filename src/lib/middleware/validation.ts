import { type NextRequest, NextResponse } from "next/server"
import { type ZodType, ZodError } from "zod"

export function withValidation<T>(schema: ZodType<T>) {
  return (
    handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>
  ) => 
    async (req: NextRequest): Promise<NextResponse> => {
      try {
        const body = await req.json()
        const validatedData = schema.parse(body)
        return handler(req, validatedData)
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json(
            {
              success: false,
              error: "Validation failed",
              details: error.issues,
            },
            { status: 400 }
          )
        }

        return NextResponse.json(
          {
            success: false,
            error: "Invalid request data",
          },
          { status: 400 }
        )
      }
    }
}

export function withErrorHandling<TArgs extends unknown[]>(
  handler: (req: NextRequest, ...args: TArgs) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: TArgs): Promise<NextResponse> => {
    try {
      return await handler(req, ...args)
    } catch (error) {
      console.error("API Error:", error)

      const errorMessage = error instanceof Error ? error.message : "Internal server error"

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 }
      )
    }
  }
}