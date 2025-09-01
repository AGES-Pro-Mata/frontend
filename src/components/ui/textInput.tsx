import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Typography } from "./typography";

interface textInputProps extends React.ComponentProps<typeof Input> {
  label?: React.ReactNode;
  required?: boolean | false;
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

  return (
    <div className={cn("flex flex-col gap-0.7", className)}>
      <Typography
        className={cn(
          "text-foreground font-medium mb-1",
        )}
      >
        {label}
        {required && <span>*</span>}
      </Typography>
      <Input
        placeholder={placeholder}
        className={cn(
          "h-[6vh] border-dark-gray px-5 py-3 text-foreground placeholder:text-muted-foreground",
          isInvalid ? "border-default-red placeholder:text-default-red focus-visible:ring-default-red" : "",
          className
        )}
        type={type}
        aria-invalid={isInvalid}
        required={required}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          Props.onChange?.(e);
        }}
        onBlur={e => {
          setTouched(true);
          Props.onBlur?.(e);
        }}
        {...Props}
      />
    </div>
  );
}
