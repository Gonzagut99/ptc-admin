const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const extractJavaErrorMessage = (error: unknown): string | undefined => {
  if (!error) return undefined;

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const err = error as Record<string, unknown>;

    // Prefer detail (specific validation errors) over generic message
    if (typeof err.detail === "string") return stripHtml(err.detail);

    // Check nested error object
    if (err.error && typeof err.error === "object") {
      const nested = err.error as Record<string, unknown>;
      if (typeof nested.detail === "string") return stripHtml(nested.detail);
      if (typeof nested.message === "string") return nested.message;
    }

    // Fallback to message
    if (typeof err.message === "string") return err.message;
  }

  return undefined;
};

export const buildJavaErrorMessage = (error: unknown, fallback: string) =>
  extractJavaErrorMessage(error) ?? fallback;
