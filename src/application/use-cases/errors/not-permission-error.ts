import { UseCaseError } from "@/core/errors/use-case-error"

export class NotPermissionError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || "You don't have permission")
  }
}
