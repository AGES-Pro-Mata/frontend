import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowInfo } from "@/components/display/showInfo";
import { Typography } from "@/components/typography/typography";
import CanvasCard from "@/components/card/canvasCard";
import { useGetAdminUser } from "@/hooks";

export interface ProfessorProfileCardProps {
  id?: string;
}

export function ProfessorProfileCard({ id }: ProfessorProfileCardProps) {
  const { data } = useGetAdminUser({ id });

  if (!data) return;

  return (
    <CanvasCard className="w-full bg-white border-none shadow-none">
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
          <div className="grid grid-cols-3 text-sm gap-6">
            <ShowInfo header="Nome Completo:" label={data.name ?? ""} />
            <ShowInfo header="Email:" label={data.email ?? ""} />
            <ShowInfo header="Telefone:" label={data.phone ?? ""} />
            <ShowInfo header="CPF:" label={data.document ?? ""} />
            <ShowInfo header="Gênero:" label={data.gender ?? ""} />
            <ShowInfo header="RG:" label={data.rg ?? ""} />
            <ShowInfo header="CEP/ZIP CODE:" label={data.zipCode ?? ""} />
            <ShowInfo header="Endereço:" label={data.addressLine ?? ""} />
            <ShowInfo header="Cidade:" label={data.city ?? ""} />
            <ShowInfo header="Número:" label={data.number?.toString() ?? ""} />
          </div>
        </div>
        <div className="mb-4">
          <Typography variant="h5" className="ml-1 text-lg text-on-banner-text">
            Informações Profissionais
          </Typography>
          <Separator className="mb-1" />
          <div className="text-sm">
            <ShowInfo header="Instituição:" label={data.institution ?? ""} />
          </div>
        </div>
      </CardContent>
    </CanvasCard>
  );
}
