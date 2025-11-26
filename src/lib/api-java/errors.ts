import { ErrorBody } from "./api-types";

type ErrorWithMessage = {
  message?: string;
  error?: ErrorBody;
};

export const extractJavaErrorMessage = (error: unknown): string | undefined => {
  if (!error) return undefined;

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const errorWithMessage = error as ErrorWithMessage;
    if (errorWithMessage.message) return errorWithMessage.message;
    if (errorWithMessage.error?.detail) return errorWithMessage.error.detail;
    if (errorWithMessage.error?.message) return errorWithMessage.error.message;
  }

  return undefined;
};

export const buildJavaErrorMessage = (error: unknown, fallback: string) =>
  extractJavaErrorMessage(error) ?? fallback;
