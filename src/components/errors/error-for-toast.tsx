import { BaseErrorResponse, BetterAuthError } from "@/lib/api/types/common";
import { ERROR_MESSAGES } from "@/utils/auth-error";
import { Label } from "../ui/label";

export const ToastErrorMessage = ({ error }: { error: BaseErrorResponse }) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Label className="text-destructive font-medium">
          {error.error?.message}
        </Label>
      </div>
      {error.error?.userMessage &&
        error.error?.message !== error.error?.userMessage && (
          <p className="text-xs text-muted-foreground font-normal leading-relaxed">
            {error.error?.userMessage}
          </p>
        )}
    </div>
  );
};

export const AuthToastErrorMessage = ({
  error,
}: {
  error: BetterAuthError;
}) => {
  const errorCode = error.code as keyof typeof ERROR_MESSAGES | undefined;
  const errorLabel = "Error de Autenticación";
  const defaultMessage = "Error de autenticación";
  const messageToShow = errorCode
    ? ERROR_MESSAGES[errorCode] || `${defaultMessage}: ${error.message}`
    : defaultMessage;
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Label className="text-destructive font-medium">{errorLabel}</Label>
      </div>
      <p className="text-xs text-muted-foreground font-normal leading-relaxed">
        {messageToShow}
      </p>
    </div>
  );
};
