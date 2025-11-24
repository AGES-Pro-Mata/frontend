import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type MultiSelectOption = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecionar Status...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selected: string) => {
    if (value.includes(selected)) {
      onChange(value.filter((v) => v !== selected));
    } else {
      onChange([...value, selected]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between min-w-56 h-12 relative", className)}
        >
          {value.length > 0 ? `Filtros selecionados (${value.length})` : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] p-2">
        <div className="flex flex-col gap-1">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-accent"
            >
              <Checkbox
                checked={value.includes(option.value)}
                onCheckedChange={() => handleSelect(option.value)}
                id={`multi-select-${option.value}`}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
