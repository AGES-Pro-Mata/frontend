import { Typography } from "@/components/typography/typography";
import { CanvasCard, CardStatus } from "@/components/card";
import { ShowInfo } from "@/components/display";
import { Button } from "@/components/button/defaultButton";
import { type ReservationStatus, getReservationStatusStyle } from "@/entities/reservation-status";
import type { RegisterUserPayload } from "@/api/user";
import { useTranslation } from "react-i18next";
import { useCurrentUserProfile } from "@/hooks";

// Mapeia códigos internos de gênero para rótulos exibidos ao usuário
export function genderLabel(g?: string, t?: (k: string) => string) {
  if (!g) return "-";
  const v = g.toLowerCase();

  if (["male", "m", "masculino"].includes(v))
    return t ? t("register.fields.gender.male") : "Masculino";
  if (["female", "f", "feminino"].includes(v))
    return t ? t("register.fields.gender.female") : "Feminino";
  if (["other", "outro", "o", "não-binário", "nao-binario"].includes(v))
    return t ? t("register.fields.gender.other") : "Outro";

  return g;
}

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
  const { verified } = useCurrentUserProfile();
  const { t } = useTranslation();
  const { className: documentStatusAccent, icon: documentStatusIcon } =
    getReservationStatusStyle(documentStatus);
  const documentStatusLabel = t(`status.${documentStatus}`);

  return (
    <CanvasCard
      className={`w-full max-w-[clamp(40rem,82vw,760px)] mx-auto p-8 sm:p-12 bg-card shadow-md rounded-[20px] ${className}`}
    >
      <div className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-2">
          <Typography className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold text-on-banner-text m-0">
            {t("profile.card.title")}
          </Typography>
        </header>

        {/* Personal Information */}
        <section className="flex flex-col gap-3">
          <Typography className="text-[clamp(1.125rem,2.5vw,1.375rem)] font-semibold text-on-banner-text">
            {t("profile.card.sections.personal")}
          </Typography>
          <div className="w-full h-px bg-on-banner-text/60" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
            <ShowInfo header={t("register.fields.fullName")} label={user.name || "-"} />
            <ShowInfo header={t("common.email")} label={user.email || "-"} />
            <ShowInfo header={t("register.fields.phone")} label={user.phone || "-"} />
            {user.document && (
              <ShowInfo
                header={
                  user.isForeign
                    ? t("register.fields.document.passport")
                    : t("register.fields.document.cpf")
                }
                label={user.document}
              />
            )}
            {user.gender && (
              <ShowInfo
                header={t("register.fields.gender.label")}
                label={genderLabel(user.gender, t)}
              />
            )}
            {user.rg && <ShowInfo header="RG" label={user.rg} />}
            {user.zipCode && <ShowInfo header={t("register.fields.zip")} label={user.zipCode} />}
            {user.addressLine && (
              <ShowInfo header={t("register.fields.address")} label={user.addressLine} />
            )}
            {user.city && <ShowInfo header={t("register.fields.city")} label={user.city} />}
            {user.number !== undefined && (
              <ShowInfo header={t("register.fields.number")} label={String(user.number)} />
            )}
            {user.function && <ShowInfo header={t("common.function")} label={user.function} />}
          </div>
        </section>

        {/* Professional Information */}
        <section className="flex flex-col gap-3">
          <Typography className="text-[clamp(1.125rem,2.5vw,1.375rem)] font-semibold text-on-banner-text">
            {t("profile.card.sections.professional")}
          </Typography>
          <div className="w-full h-px bg-on-banner-text/60" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 grid grid-cols-1">
              {user.institution && (
                <ShowInfo header={t("register.fields.institution")} label={user.institution} />
              )}
            </div>
            <div className="flex flex-row flex-wrap items-center gap-4">
              <Button
                label={
                  verified
                    ? t("profile.card.docency.receiptSent")
                    : t("profile.card.docency.sendReceipt")
                }
                variant="gray"
                className="px-6 py-3 text-sm font-medium rounded-md disabled:opacity-50"
                onClick={onSendDocument}
                disabled={verified || disableSendDocument || !onSendDocument}
              />
              <CardStatus
                icon={documentStatusIcon}
                label={documentStatusLabel}
                accentClassName={documentStatusAccent}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-2">
          <Button label={t("profile.card.editButton")} variant="primary" onClick={onEdit} />
        </div>
      </div>
    </CanvasCard>
  );
}

export default UserProfileCard;
