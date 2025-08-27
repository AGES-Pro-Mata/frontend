import * as React from "react";

import { Input } from "@/components/ui/input"

interface textInputProps {
    children?: React.ReactNode;
    label: string;
}

export function textInput({children, label}: textInputProps) {
    return (
        <div className="flex flex-col gap-2">
            {children && <label>{children}</label>}
                <Input type="text" placeholder={label}/>
        </div>
    )
}