"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface EditProfessionalProfileCardProps {
    isInstitutionDirty: boolean;
}

export function EditProfessionalProfileCard({ isInstitutionDirty }: EditProfessionalProfileCardProps) {
    const { control, register, formState: { errors } } = useFormContext();

    return (
        <div className="w-full rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="mb-1 text-2xl font-semibold tracking-tight">
                Informações Profissionais
            </h2>
            <hr className="mb-6" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* Instituição */}
                <div className="space-y-2">
                    <Label htmlFor="institution">Instituição</Label>
                    <Input
                        id="institution"
                        placeholder="Universidade/Empresa"
                        {...register("institution")}
                    />
                </div>

                {/* Função (Adapte o name se necessário) */}
                <div className="space-y-2">
                    <Label>Função</Label>
                    <Select>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Selecione sua Função" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="estudante">Estudante</SelectItem>
                            <SelectItem value="professor">Professor(a)</SelectItem>
                            <SelectItem value="pesquisador">Pesquisador(a)</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-6 flex items-center space-x-2">
                <Checkbox id="teacher-request" />
                <Label
                    htmlFor="teacher-request"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Gostaria de solicitar um cadastro de docente
                </Label>
            </div>

            <Button variant="outline" className="mt-4" disabled={!isInstitutionDirty}>
                Enviar comprovante agora
            </Button>
        </div>
    );
}