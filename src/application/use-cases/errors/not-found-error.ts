import { UseCaseError } from "@/core/errors/use-case-error";

export class NotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || "Resource not found");
  }
}