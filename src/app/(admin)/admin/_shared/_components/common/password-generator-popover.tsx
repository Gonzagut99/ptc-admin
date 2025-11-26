"use client";
import { Key, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { useGenerateRandomPass } from "../../_hooks/use-generate-password";

interface PasswordGeneratorPopoverProps {
  onGenerated: (password: string) => void;
  disabled?: boolean;
}

export function PasswordGeneratorPopover({
  onGenerated,
  disabled = false,
}: PasswordGeneratorPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [length, setLength] = useState(12);
  const { generateRandomPass, isLoading } = useGenerateRandomPass();

  const handleGenerate = async () => {
    await generateRandomPass((generatedPassword) => {
      onGenerated(generatedPassword);
      setIsOpen(false);
    }, length);
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!Number.isNaN(value)) {
      // Limitar entre 8 y 128 caracteres
      const clampedValue = Math.max(8, Math.min(128, value));
      setLength(clampedValue);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled || isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Key className="h-4 w-4 shrink-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">
                Generar contraseña aleatoria
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Configura la longitud de la contraseña que deseas generar. La
              contraseña cumplirá con todos los requisitos de seguridad.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="password-length">Longitud de la contraseña</Label>
            <div className="flex items-center gap-3">
              <Input
                id="password-length"
                type="number"
                min={8}
                max={128}
                value={length}
                onChange={handleLengthChange}
                className="w-20"
                disabled={isLoading}
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>8</span>
                  <span className="font-medium text-foreground">
                    {length} caracteres
                  </span>
                  <span>128</span>
                </div>
                <Slider
                  value={[length]}
                  onValueChange={(values) => setLength(values[0])}
                  min={8}
                  max={128}
                  step={1}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Recomendado: 12-16 caracteres para mayor seguridad
            </p>
          </div>

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Generando...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Generar contraseña
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
