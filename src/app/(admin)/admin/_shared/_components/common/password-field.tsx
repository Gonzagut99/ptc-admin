"use client";
import { Check, Circle, Info } from "lucide-react";
import { useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PasswordGeneratorPopover } from "./password-generator-popover";

interface PasswordFieldProps {
  field: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  isPending: boolean;
  onGeneratePassword: (password: string) => void;
  placeholder?: string;
  showIsRequired?: boolean;
}

export function PasswordField({
  field,
  isPending,
  onGeneratePassword,
  showIsRequired = true,
  placeholder = "Ingrese la contraseña",
}: PasswordFieldProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const passwordValue = field.value || "";

  // Password validation checks
  const passwordChecks = {
    minLength: passwordValue.length >= 8,
    hasUpperCase: /[A-Z]/.test(passwordValue),
    hasLowerCase: /[a-z]/.test(passwordValue),
    hasNumber: /\d/.test(passwordValue),
    hasSpecialChar: /[@$!%*?&_]/.test(passwordValue),
  };

  return (
    <FormItem>
      <FormLabel required={showIsRequired}>Contraseña </FormLabel>
      <FormControl>
        <div className="relative flex items-center gap-2">
          <InputGroup>
            <InputGroupInput
              disabled={isPending}
              placeholder={placeholder}
              {...field}
              onFocus={() => setIsTooltipOpen(true)}
              onBlur={() => {
                field.onBlur();
                setIsTooltipOpen(false);
              }}
            />
            <InputGroupAddon align="inline-end">
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger
                  tabIndex={-1}
                  asChild
                  type="button"
                  onClick={() => setIsTooltipOpen((prev) => !prev)}
                >
                  <Info className="w-4 h-4 shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="w-64 bg-card">
                  <div className="p-2">
                    <p className="font-medium mb-2">
                      La contraseña tiene que tener:
                    </p>
                    <ul className="space-y-1.5">
                      <li
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          passwordChecks.minLength
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="relative w-4 h-4 shrink-0">
                          <Check
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.minLength
                                ? "opacity-100 scale-100 text-emerald-600"
                                : "opacity-0 scale-0"
                            }`}
                          />
                          <Circle
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.minLength
                                ? "opacity-0 scale-0"
                                : "opacity-100 scale-100 text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span
                          className={
                            passwordChecks.minLength ? "font-medium" : ""
                          }
                        >
                          Al menos 8 caracteres
                        </span>
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          passwordChecks.hasUpperCase
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="relative w-4 h-4 shrink-0">
                          <Check
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasUpperCase
                                ? "opacity-100 scale-100 text-emerald-600"
                                : "opacity-0 scale-0"
                            }`}
                          />
                          <Circle
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasUpperCase
                                ? "opacity-0 scale-0"
                                : "opacity-100 scale-100 text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span
                          className={
                            passwordChecks.hasUpperCase ? "font-medium" : ""
                          }
                        >
                          Al menos 1 letra mayúscula
                        </span>
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          passwordChecks.hasLowerCase
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="relative w-4 h-4 shrink-0">
                          <Check
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasLowerCase
                                ? "opacity-100 scale-100 text-emerald-600"
                                : "opacity-0 scale-0"
                            }`}
                          />
                          <Circle
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasLowerCase
                                ? "opacity-0 scale-0"
                                : "opacity-100 scale-100 text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span
                          className={
                            passwordChecks.hasLowerCase ? "font-medium" : ""
                          }
                        >
                          Al menos 1 letra minúscula
                        </span>
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          passwordChecks.hasNumber
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="relative w-4 h-4 shrink-0">
                          <Check
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasNumber
                                ? "opacity-100 scale-100 text-emerald-600"
                                : "opacity-0 scale-0"
                            }`}
                          />
                          <Circle
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasNumber
                                ? "opacity-0 scale-0"
                                : "opacity-100 scale-100 text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span
                          className={
                            passwordChecks.hasNumber ? "font-medium" : ""
                          }
                        >
                          Al menos 1 número
                        </span>
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          passwordChecks.hasSpecialChar
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="relative w-4 h-4 shrink-0">
                          <Check
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasSpecialChar
                                ? "opacity-100 scale-100 text-emerald-600"
                                : "opacity-0 scale-0"
                            }`}
                          />
                          <Circle
                            className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
                              passwordChecks.hasSpecialChar
                                ? "opacity-0 scale-0"
                                : "opacity-100 scale-100 text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span
                          className={
                            passwordChecks.hasSpecialChar ? "font-medium" : ""
                          }
                        >
                          Al menos 1 carácter especial (@$!%*?&_)
                        </span>
                      </li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <PasswordGeneratorPopover
            onGenerated={onGeneratePassword}
            disabled={isPending}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
