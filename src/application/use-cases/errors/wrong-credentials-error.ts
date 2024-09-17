import { UseCaseError } from "@/core/errors/use-case-error"

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || "Wrong credentials")
  }
}
