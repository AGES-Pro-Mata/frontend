import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowInfo } from "@/components/display/showInfo";
import { Typography } from "@/components/typography/typography";
import type { ProfessorApprovalDetails } from "@/api/professor";
import CanvasCard from "@/components/cards/canvasCard";

export interface ProfessorProfileCardProps {
  professor: ProfessorApprovalDetails;
}

export function ProfessorProfileCard({ professor }: ProfessorProfileCardProps) {
  return (
    <CanvasCard className="w-full max-w-lg bg-white border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-main-dark-green">
          Perfil Professor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Typography variant="h5" className="ml-1 text-lg text-on-banner-text">
            Informações Pessoais
          </Typography>
          <Separator className="mb-1" />
          <div className="grid grid-cols-2 text-sm">
            <ShowInfo header="Nome Completo:" label={professor.name ?? ""} />
            <ShowInfo header="Email:" label={professor.email ?? ""} />
            <ShowInfo header="Telefone:" label={professor.phone ?? ""} />
            <ShowInfo header="CPF:" label={professor.document ?? ""} />
            <ShowInfo header="Gênero:" label={professor.gender ?? ""} />
            <ShowInfo header="RG:" label={professor.rg ?? ""} />
            <ShowInfo header="CEP/ZIP CODE:" label={professor.zipCode ?? ""} />
            <ShowInfo header="Endereço:" label={professor.addressLine ?? ""} />
            <ShowInfo header="Cidade:" label={professor.city ?? ""} />
            <ShowInfo
              header="Número:"
              label={
                professor.number !== undefined && professor.number !== null
                  ? String(professor.number)
                  : ""
              }
            />
          </div>
        </div>
        <div className="mb-4">
          <Typography variant="h5" className="ml-1 text-lg text-on-banner-text">
            Informações Profissionais
          </Typography>
          <Separator className="mb-1" />
          <div className="text-sm">
            <ShowInfo
              header="Instituição:"
              label={professor.institution ?? ""}
            />
          </div>
        </div>
      </CardContent>
    </CanvasCard>
  );
}
