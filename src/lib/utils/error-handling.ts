// Production-grade error handling utilities

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const

export const handleApiError = (error: unknown): { error: string; code: string; statusCode: number } => {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      code: ErrorCodes.INTERNAL_ERROR,
      statusCode: 500,
    }
  }

  return {
    error: 'An unexpected error occurred',
    code: ErrorCodes.INTERNAL_ERROR,
    statusCode: 500,
  }
}

export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<{ data?: T; error?: string }> => {
  try {
    const data = await fn()
    return { data }
  } catch (error) {
    console.error(errorMessage, error)
    const { error: message } = handleApiError(error)
    return { error: message }
  }
}

export const retryOperation = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError!
}
