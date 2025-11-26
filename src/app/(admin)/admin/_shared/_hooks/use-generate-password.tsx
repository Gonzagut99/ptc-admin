import { generate } from "generate-password";
import { useState } from "react";
import { toast } from "sonner";

export const standardizedSymbols = "@$!%*?&";

export function useGenerateRandomPass() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const validatePassWordHasCorrectFormat = (pass: string) => {
    // Usar la misma regex exacta que el backend
    const backendRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return backendRegex.test(pass);
  };

  const generateRandomPass = async (
    onGenerated?: (password: string) => void,
    length: number = 12,
  ) => {
    setIsLoading(true);

    const attemptGeneration = async (attempt: number = 1): Promise<string> => {
      // Validar que la longitud sea válida (mínimo 8, máximo 128)
      const validLength = Math.max(8, Math.min(128, length));

      const generatedPassword = generate({
        length: validLength,
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: standardizedSymbols,
        excludeSimilarCharacters: true,
        strict: true, // Asegurar que se incluyan todos los tipos de caracteres
      });

      if (validatePassWordHasCorrectFormat(generatedPassword)) {
        return generatedPassword;
      }

      // Limitar intentos para evitar bucles infinitos
      if (attempt >= 10) {
        throw new Error(
          "No se pudo generar una contraseña válida después de 10 intentos",
        );
      }

      return attemptGeneration(attempt + 1);
    };

    try {
      const validPassword = await attemptGeneration();
      setPassword(validPassword);
      onGenerated?.(validPassword);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al generar la contraseña aleatoria. Por favor, inténtalo de nuevo.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearPassword = () => {
    setPassword(undefined);
    setIsLoading(false);
  };

  return {
    password,
    isLoading,
    generateRandomPass,
    clearPassword,
  };
}
