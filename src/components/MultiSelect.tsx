"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Option {
    id: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    title: string;
}


const MultiSelect = ({ options, title }: MultiSelectProps) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);


    const handleCheckboxChange = (optionId: string) => {
        setSelectedOptions((prevSelectedOptions) => {
            if (prevSelectedOptions.includes(optionId)) {
                return prevSelectedOptions.filter((id) => id !== optionId);
            } else {
                return [...prevSelectedOptions, optionId];
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={option.id}
                                checked={selectedOptions.includes(option.id)}
                                onCheckedChange={() => handleCheckboxChange(option.id)}
                            />
                            <Label htmlFor={option.id}>
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default MultiSelect;
