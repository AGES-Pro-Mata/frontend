"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Option {
    id: string;
    label: string;
}

interface RadioSelectProps {
    options: Option[];
    title: string;
}


const RadioSelect = ({ options, title }: RadioSelectProps) => {
    const [selectedOption, setSelectedOption] = useState<string>("");



    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                    className="space-y-4">
                    {options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id}
                                id={option.id}

                            />
                            <Label htmlFor={option.id}>
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
};

export default RadioSelect;
