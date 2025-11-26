"use client";

import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useFormField } from "./form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const disabled =
    props.value === "" || props.value === undefined || props.disabled;
  //escuchar el error de shadcn
  const { error } = useFormField();
  return (
    <div className="relative">
      <InputGroup
        className={cn(
          error &&
            "border-destructive ring-destructive focus-visible:ring-destructive/40 focus-visible:border-destructive",
          "pr-10",
          className,
        )}
        aria-invalid={error ? true : undefined}
      >
        <InputGroupAddon align="inline-start">
          <Lock className="w-4 h-4" />
        </InputGroupAddon>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          className="hide-password-toggle"
          ref={ref}
          {...props}
        />
      </InputGroup>
      <Button
        type="button"
        variant="icon"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
				.hide-password-toggle::-ms-reveal,
				.hide-password-toggle::-ms-clear {
					visibility: hidden;
					pointer-events: none;
					display: none;
				}
			`}</style>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
