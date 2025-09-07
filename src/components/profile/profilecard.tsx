// src/components/profile/profilecard.tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import CanvasCard from "@/components/cards/canvasCard";
import CardStatus, {
  StatusEnum,
  type ReservationStatus,
} from "@/components/cards/cardStatus";
import { Typography } from "@/components/typography/typography";
import { Separator } from "@/components/ui/separator";
import { DefaultButton } from "@/components/buttons/defaultButton";

// mock; trocar por chamada real depois
async function fetchComprovanteStatus(): Promise<{ status: ReservationStatus }> {
  return { status: StatusEnum.AGUARDANDO_APROVACAO };
}

export default function ProfileCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["comprovante-status"],
    queryFn: fetchComprovanteStatus,
  });

  return (
    <div className="container mx-auto max-w-[680px] py-6 md:py-8">
      {/* padding interno: md:px-[104px] md:py-[76px] */}
      <CanvasCard className="px-6 py-6 md:px-[104px] md:py-[76px] shadow-lg">
        <Typography
          variant="h3"
          className="text-center mb-6 md:mb-8 tracking-tight font-semibold text-[32px]"
          style={{ color: "#2E361D" }}
        >
          Meu Perfil
        </Typography>

        {/* Informações pessoais */}
        <section className="mb-8">
          <Typography
            variant="h5"
            className="text-on-banner-text text-xl font-semibold"
          >
            Informações pessoais
          </Typography>
          <Separator className="my-2 opacity-60" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8 text-sm">
            <Info label="Nome Completo" value="João da Silva" />
            <Info label="Email" value="joao@dasilva.com" />
            <Info label="Telefone" value="(55) 99999-9999" />
            <Info label="CPF" value="123.456.789-00" />
            <Info label="Gênero" value="Masculino" />
            <Info label="RG" value="1234567890" />
            <Info label="CEP/ZIP CODE" value="12345-666" />
            <Info label="Endereço" value="Rua do Limoeiro" />
            <Info label="Cidade" value="São Paulo" />
            <Info label="Número" value="100" />
          </div>
        </section>

        {/* Informações profissionais */}
        <section>
          <Typography
            variant="h5"
            className="text-on-banner-text text-xl font-semibold"
          >
            Informações profissionais
          </Typography>
          <Separator className="my-2 opacity-60" />

          <div className="text-sm">
            <Info label="Instituição" value="PUCRS | Professor" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <DefaultButton
              label="Enviar comprovante"
              variant="secondary"
              className="w-[184px]"
              onClick={() => alert("Abrir modal de envio de comprovante")}
            />

            {isLoading ? (
              <span className="text-muted-foreground text-sm">
                Carregando status…
              </span>
            ) : (
              <CardStatus
                status={data?.status ?? StatusEnum.AGUARDANDO_APROVACAO}
              />
            )}
          </div>
        </section>

        {/* Editar Dados */}
        <div className="mt-12 md:mt-14 flex justify-center">
          <Link to="/(index)/edit-profile">
            <DefaultButton
              label="Editar Dados"
              variant="primary"
              className="w-[158px]"
            />
          </Link>
        </div>
      </CanvasCard>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-foreground font-semibold text-base">
        {label}
      </span>
      <span className="block text-foreground font-medium text-sm mt-2">
        • {value}
      </span>
    </div>
  );
}
