import * as React from "react";

import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

interface textInputProps extends React.ComponentProps<typeof Input> {
    children?: React.ReactNode;
    labelClassName: string;
    wrapperClassName?: string;  
}

export function textInput({
    children,
    placeholder,
    wrapperClassName,
    labelClassName,
    className,
    ...Props
    }: textInputProps) {
    return (
        <div className={cn("flex flex-col gap-2", wrapperClassName)}>
            {children && <label className={cn("text-sm font--medium", labelClassName)}>{children}</label>}
                <Input 
                placeholder={placeholder}
                className={cn("", className)} 
                {...Props}
                />
        </div>
    )
}