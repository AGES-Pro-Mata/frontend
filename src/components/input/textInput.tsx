import * as React from "react";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { Typography } from "../typography/typography";

interface textInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
}

export function TextInput({
  label,
  required,
  type,
  placeholder,
  className,
  ...Props
}: textInputProps) {
  const [value, setValue] = React.useState(Props.value ?? "");
  const [touched, setTouched] = React.useState(false);
  const isInvalid = required && touched && !value;

  // Keep local state in sync with external value updates (e.g., programmatic form.setValue)
  React.useEffect(() => {
    setValue((Props.value as string) ?? "");
  }, [Props.value]);

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
      <Input
        placeholder={placeholder}
        className={cn(
          "h-12 px-5 py-3 text-foreground placeholder:text-muted-foreground",
          isInvalid
            ? "border-default-red placeholder:text-default-red focus-visible:ring-default-red"
            : "",
          className
        )}
        type={type}
        aria-invalid={isInvalid}
        required={required}
        value={value}
        {...Props}
        onChange={(e) => {
          setValue(e.target.value);
          Props.onChange?.(e);
        }}
        onBlur={(e) => {
          setTouched(true);
          Props.onBlur?.(e);
        }}
      />
    </div>
  );
}
