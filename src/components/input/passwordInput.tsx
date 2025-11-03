
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography/typography";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
    label?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function PasswordInput({
  label,
  value = "",
  onChange,
  name,
  required = false,
  disabled = false,
  error,
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const isInvalid = required && touched && !value;

  return (
    <div className={cn("flex flex-col gap-0.7", className)}>
      {label && (
        <Typography
          className={cn(
            "mb-1 flex flex-wrap items-center gap-1 text-foreground font-medium leading-tight"
          )}
        >
          <span className="whitespace-pre-wrap">{label}</span>
          {required && <span>*</span>}
        </Typography>
      )}
      <div className="relative">
        <Input
          id={name || "password"}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => {
            onChange?.(e);
          }}
          name={name}
          required={required}
          disabled={disabled}
          aria-invalid={isInvalid}
          className={cn(
            "h-12 px-5 py-3 text-foreground placeholder:text-muted-foreground pr-10",
            isInvalid
              ? "border-default-red placeholder:text-default-red focus-visible:ring-default-red"
              : "",
            className
          )}
          onBlur={() => setTouched(true)}
          {...props}
        />
        <button
          type="button"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 flex items-center"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5C16.89 4.5 21.27 7.61 23 12C21.27 16.39 16.89 19.5 12 19.5C7.11 19.5 2.73 16.39 1 12Z" stroke="#333" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2"/>
              <line x1="4" y1="20" x2="20" y2="4" stroke="#333" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5C16.89 4.5 21.27 7.61 23 12C21.27 16.39 16.89 19.5 12 19.5C7.11 19.5 2.73 16.39 1 12Z" stroke="#333" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
      <span className="text-muted-foreground text-sm mt-1">Min 8 caracteres</span>
      {error && <span className="text-default-red text-sm mt-1">{error}</span>}
    </div>
  );
}