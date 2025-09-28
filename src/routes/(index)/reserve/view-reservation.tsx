import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import Layout from "@/components/layouts/dashboard";
import { Typography } from "@/components/typography";
import { Button } from "@/components/buttons/defaultButton";
import { SummaryExperience } from "@/components/display";
import { ReservationForm, type ReservationFormData } from "@/components/forms/reservationForm";
import type { Locale } from "@/types/locale";

const mockUsersData = {
    users: [
        { id: 1, name: "Ana Beatriz Costa", phone: "(51) 99999-9999", birthDate: "15/08/1990", cpf: "123.456.789-01", gender: "feminino" as const },
        { id: 2, name: "Carlos Eduardo Lima", phone: "(51) 98888-8888", birthDate: "22/12/1995", cpf: "987.654.321-02", gender: "masculino" as const },
        { id: 3, name: "Mariana Almeida", phone: "(51) 97777-7777", birthDate: "11/03/2000", cpf: "111.222.333-03", gender: "feminino" as const },
    ],
};

const mockExperiences: {id: number, experience: string, startDate: string, endDate: string, price: number, capacity: number, locale: Locale}[] = [
    { id: 1, experience: "Trilha na Serra Gaúcha", startDate: "2025-10-20T00:00:00.000Z", endDate: "2025-10-22T00:00:00.000Z", price: 450.0, capacity: 15, locale: "pt-BR" }
];


export const Route = createFileRoute("/(index)/reserve/view-reservation")({
    component: VisualizarReservaPage,
});

function VisualizarReservaPage() {
    const navigate = useNavigate();
    const [isEditable, setIsEditable] = useState(false);

    const handleFormSubmit = (data: ReservationFormData) => {
        console.log("Dados da reserva atualizados:", data);
        toast.success("Reserva atualizada com sucesso!");
        setIsEditable(false);
    };

    const handleBackClick = () => {
        navigate({ to: '/user/my-reservations'});
    };


    return (
        <Layout>
            <Layout.Content className="bg-gray-50 py-8">
                <main className="max-w-6xl mx-auto p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h2" className="text-2xl font-semibold">
                            {isEditable ? "Editar Reserva" : "Visualizar Reserva"}
                        </Typography>
                        {!isEditable && (
                            <Button
                                label="Editar Reserva"
                                variant="ghost"
                                onClick={() => setIsEditable(true)}
                            />
                        )}
                    </div>
                    <ReservationForm
                        initialData={mockUsersData}
                        isEditable={isEditable}
                        onSubmit={handleFormSubmit}
                    />

                    <div className="my-8 p-4 bg-gray-50 rounded-md border">
                        <Typography variant="body" className="text-muted-foreground text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam gravida massa et metus rhoncus gravida. Sed elementum velit purus.
                        </Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {mockExperiences.map((xp) => (
                            <SummaryExperience key={xp.id} {...xp} />
                        ))}
                    </div>

                    <div className="mt-12 flex justify-end gap-4">
                        <Button
                            type="button"
                            label={isEditable ? "Cancelar" : "Voltar"}
                            variant="secondary"
                            className="w-40"
                            onClick={isEditable ? () => setIsEditable(false) : handleBackClick}
                        />
                    </div>

                </main>
            </Layout.Content>
        </Layout>
    );
}