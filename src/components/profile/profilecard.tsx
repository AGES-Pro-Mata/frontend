import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import CanvasCard from "@/components/cards/canvasCard";
import CardStatus, { StatusEnum } from "@/components/cards/cardStatus";
import { Typography } from "@/components/typography/typography";
import { Separator } from "@/components/ui/separator";
import { DefaultButton } from "@/components/buttons/defaultButton";
import { getCurrentUserRequest, type UserProfile } from "@/api/user";

export default function ProfileCard() {
  const { data: me, isLoading: loadingMe, isError: errorMe } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: getCurrentUserRequest,
    staleTime: 5 * 60 * 1000,
  });

  // endpoint de status do comprovante
  const isLoadingDoc = false;
  const statusDoc = StatusEnum.AGUARDANDO_APROVACAO;

  return (
    <div className="container mx-auto max-w-[680px] py-6 md:py-8">
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

          {errorMe ? (
            <span className="text-sm text-red-600">
              Não foi possível carregar seus dados.
            </span>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8 text-sm">
              <Info label="Nome Completo" value={loadingMe ? "—" : me?.name ?? "—"} />
              <Info label="Email" value={loadingMe ? "—" : me?.email ?? "—"} />
              <Info label="Telefone" value={loadingMe ? "—" : me?.phone ?? "—"} />
              <Info label="CPF" value={loadingMe ? "—" : me?.cpf ?? "—"} />
              <Info label="Gênero" value={loadingMe ? "—" : me?.gender ?? "—"} />
              <Info label="RG" value={loadingMe ? "—" : me?.rg ?? "—"} />
              <Info label="CEP/ZIP CODE" value={loadingMe ? "—" : me?.zipCode ?? "—"} />
              <Info label="Endereço" value={loadingMe ? "—" : me?.addressLine ?? "—"} />
              <Info label="Cidade" value={loadingMe ? "—" : me?.city ?? "—"} />
              <Info label="Número" value={loadingMe ? "—" : (me?.number != null ? String(me.number) : "—")} />
            </div>
          )}
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
            <Info
              label="Instituição"
              value={
                loadingMe
                  ? "—"
                  : `${me?.institution ?? "—"}${me?.function ? ` | ${me.function}` : ""}`
              }
            />
          </div>

        {/* Ações + Status */}
          <div className="mt-4 flex items-center gap-3">
            <DefaultButton
              label="Enviar comprovante"
              variant="secondary"
              className="w-[184px]"
              onClick={() => alert("Abrir modal de envio de comprovante")}
            />
            {isLoadingDoc ? (
              <span className="text-muted-foreground text-sm">Carregando status…</span>
            ) : (
              <CardStatus status={statusDoc} />
            )}
          </div>
        </section>

        {/* Editar Dados */}
        <div className="mt-12 md:mt-14 flex justify-center">
          <Link to="/(index)/edit-profile">
            <DefaultButton label="Editar Dados" variant="primary" className="w-[158px]" />
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
