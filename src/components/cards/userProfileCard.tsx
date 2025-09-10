import { Typography } from "@/components/typography/typography";
import { CanvasCard, CardStatus } from "@/components/cards";
import { ShowInfo } from "@/components/display";
import { Button } from "@/components/buttons/defaultButton";
import type { ReservationStatus } from "@/components/cards/cardStatus";
import type { RegisterUserPayload } from "@/api/user";
import { Link } from "@tanstack/react-router";

export interface UserProfileCardProps {
  user: Partial<RegisterUserPayload>;
  documentStatus: ReservationStatus;
  onEdit?: () => void;
  onSendDocument?: () => void;
  disableSendDocument?: boolean;
  className?: string;
}

export function UserProfileCard({
  user,
  documentStatus,
  onEdit,
  onSendDocument,
  disableSendDocument = false,
  className = "",
}: UserProfileCardProps) {
  return (
    <CanvasCard
      className={`w-full max-w-[clamp(40rem,82vw,760px)] mx-auto p-8 sm:p-12 bg-card shadow-md rounded-[20px] ${className}`}
    >
      <div className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-2">
          <Typography className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold text-on-banner-text m-0">
            Meu Perfil
          </Typography>
        </header>

        {/* Informações Pessoais */}
        <section className="flex flex-col gap-3">
          <Typography className="text-[clamp(1.125rem,2.5vw,1.375rem)] font-semibold text-on-banner-text">
            Informações pessoais
          </Typography>
          <div className="w-full h-px bg-on-banner-text/60" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
            <ShowInfo header="Nome Completo" label={user.name || "-"} />
            <ShowInfo header="Email" label={user.email || "-"} />
            <ShowInfo header="Telefone" label={user.phone || "-"} />
            {user.cpf && <ShowInfo header="CPF" label={user.cpf} />}
            {user.gender && <ShowInfo header="Gênero" label={user.gender} />}
            {user.rg && <ShowInfo header="RG" label={user.rg} />}
            {user.zipCode && (
              <ShowInfo header="CEP/ZIP CODE" label={user.zipCode} />
            )}
            {user.addressLine && (
              <ShowInfo header="Endereço" label={user.addressLine} />
            )}
            {user.city && <ShowInfo header="Cidade" label={user.city} />}
            {user.number !== undefined && (
              <ShowInfo header="Número" label={String(user.number)} />
            )}
          </div>
        </section>

        {/* Informações Profissionais */}
        <section className="flex flex-col gap-3">
          <Typography className="text-[clamp(1.125rem,2.5vw,1.375rem)] font-semibold text-on-banner-text">
            Informações Profissionais
          </Typography>
          <div className="w-full h-px bg-on-banner-text/60" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 grid grid-cols-1">
              {user.institution && (
                <ShowInfo header="Instituição" label={user.institution} />
              )}
            </div>
            <div className="flex flex-row flex-wrap items-center gap-4">
              <Button
                label="Enviar comprovante"
                variant="gray"
                className="px-6 py-3 text-sm font-medium rounded-md disabled:opacity-50"
                onClick={onSendDocument}
                disabled={disableSendDocument || !onSendDocument}
              />
              <CardStatus status={documentStatus} />
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-2">
          <Link to="/user/profile/edit-profile" className="contents">
            <Button
              label="Editar Dados"
              variant="primary"
              className="px-8 py-3 text-sm font-semibold rounded-md"
              onClick={onEdit}
            />
          </Link>
        </div>
      </div>
    </CanvasCard>
  );
}

export default UserProfileCard;
