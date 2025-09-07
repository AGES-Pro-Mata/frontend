"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { EditPersonalProfileCard } from "@/components/cards/editPersonalProfileCard";
import { EditProfessionalProfileCard } from "@/components/cards/editProfessionalProfileCard";
import { Button } from "@/components/ui/button";
import {userQueryOptions, updateUserRequest, type UpdateUserPayload} from "@/api/user";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute('/(index)/my-profile/edit-profile')({
    component: EditProfilePage,
})

function EditProfilePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError } = useQuery(userQueryOptions);

    const formMethods = useForm<UpdateUserPayload>({
        defaultValues: {
            fullName: '',
            phone: '',
            gender: '',
            city: '',
            addressLine: '',
            country: '',
            zip: '',
            number: '',
            institution: '',
        }
    });

    const { handleSubmit, reset, formState: { isSubmitting, errors, dirtyFields } } = formMethods;

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName || '',
                phone: user.phone || '',
                gender: user.gender || '',
                city: user.city || '',
                addressLine: user.addressLine || '',
                country: user.country || '',
                zip: user.zip || '',
                number: user.number || '',
                institution: user.institution || '',
            });
        }
    }, [user, reset]);

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: (payload: UpdateUserPayload) => {
            if (!user?.id) throw new Error("ID do usuário não encontrado.");
            return updateUserRequest({ userId: user.id, payload });
        },
        onSuccess: () => {
            alert("Perfil atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["me"] });
            // MODIFICADO: Usando a função navigate
            navigate({ to: '/my-profile' });
        },
        onError: (error) => {
            console.error(error);
            alert("Erro ao atualizar o perfil. Tente novamente.");
        },
    });

    const onSubmit = (data: UpdateUserPayload) => {
        updateUser(data);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Carregando...</div>;
    }

    if (isError || !user) {
        return <div className="text-center py-10 text-red-500">Erro ao carregar as informações do usuário.</div>;
    }

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto max-w-4xl py-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Editar Cadastro</h1>
                    <p className="text-muted-foreground">
                        Preencha os dados abaixo para editar sua conta
                    </p>
                </div>

                <div className="mt-8 space-y-8">
                    <EditPersonalProfileCard />
                    <EditProfessionalProfileCard isInstitutionDirty={!!dirtyFields.institution} />
                </div>

                <div className="mt-10 flex justify-end space-x-4">
                    {/* MODIFICADO: Usando a função navigate para o botão Voltar */}
                    <Button type="button" variant="outline" onClick={() => navigate({ to: '/my-profile' })}>
                        Voltar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}