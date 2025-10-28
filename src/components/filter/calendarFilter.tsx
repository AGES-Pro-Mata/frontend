"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Calendar22Props {
  placeholder?: string
  value?: Date
  onChange?: (date?: Date) => void
  className?: string
  disabled?: React.ComponentProps<typeof Calendar>["disabled"]
  displayFormat?: (date: Date) => string
}

export function Calendar22({
  placeholder = "Select date",
  value,
  onChange,
  className,
  disabled,
  displayFormat,
}: Calendar22Props) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  React.useEffect(() => {
    setDate(value ? new Date(value) : undefined)
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              "h-14 w-full justify-between rounded-full border-card/60 bg-white px-8 text-base font-medium text-on-banner-text shadow-none",
              "hover:bg-card/20 hover:text-on-banner-text focus-visible:border-main-dark-green focus-visible:ring-main-dark-green/10",
              !date && "text-on-banner-text/70",
              className
            )}
          >
            {date ? (displayFormat ? displayFormat(date) : date.toLocaleDateString()) : placeholder}
            <ChevronDownIcon className="size-5 text-on-banner-text/50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden border border-card/60 bg-popover p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
