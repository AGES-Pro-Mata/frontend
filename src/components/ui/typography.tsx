import { cn } from "@/lib/utils";

const variants = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  h4: "text-xl font-bold",
  h5: "text-lg font-bold",
  h6: "text-base font-bold",
  body: "text-base",
} as const;

type Variant = keyof typeof variants;

type TypographyProps = React.ComponentPropsWithoutRef<"p"> & {
  variant?: Variant;
};

export function Typography({
  className,
  variant = "body",
  ...props
}: TypographyProps) {
  return (
    <p
      className={cn(
        "text-base leading-6 text-muted-foreground",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
