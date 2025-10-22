import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TextInput } from "@/components/inputs/textInput";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, digitsOnly, maskCpf, maskPhone } from "@/lib/utils";
import type {
  ReserveParticipantDraft,
  ReserveParticipantGender,
} from "@/types/reserve";

export type ReserveParticipantInputsProps = {
  person: ReserveParticipantDraft;
  readOnly?: boolean;
  disabled?: boolean;
  onFieldChange?: <K extends keyof ReserveParticipantDraft>(
    field: K,
    value: ReserveParticipantDraft[K]
  ) => void;
  className?: string;
};

export function ReserveParticipantInputs({
  person,
  readOnly = false,
  disabled = false,
  onFieldChange,
  className,
}: ReserveParticipantInputsProps) {
  const { t } = useTranslation();

  const genderOptions = useMemo(
    () => ({
      FEMALE: t("reserveFlow.peopleStep.genderOptions.female"),
      MALE: t("reserveFlow.peopleStep.genderOptions.male"),
      OTHER: t("reserveFlow.peopleStep.genderOptions.other"),
      NOT_INFORMED: t("reserveFlow.peopleStep.genderOptions.notInformed"),
    }),
    [t]
  ) as Record<ReserveParticipantGender, string>;

  const handleChange = <K extends keyof ReserveParticipantDraft>(
    field: K,
    value: ReserveParticipantDraft[K]
  ) => {
    if (onFieldChange) {
      onFieldChange(field, value);
    }
  };

  const handlePhoneChange = (value: string) => {
    const digits = digitsOnly(value).slice(0, 11);

    handleChange("phone", maskPhone(digits));
  };

  const handleCpfChange = (value: string) => {
    const digits = digitsOnly(value).slice(0, 11);

    handleChange("cpf", maskCpf(digits));
  };

  const isReadOnly = readOnly === true;
  const isSelectDisabled = disabled || isReadOnly;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5",
        className
      )}
    >
      <TextInput
        label={t("reserveFlow.peopleStep.fields.name.label")}
        required
        placeholder={t("reserveFlow.peopleStep.fields.name.placeholder")}
        value={person.name}
        onChange={(event) => handleChange("name", event.target.value)}
        disabled={disabled}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : undefined}
        className={cn(
          "xl:min-w-[12rem]",
          isReadOnly ? "pointer-events-none text-main-dark-green" : undefined
        )}
      />
      <TextInput
        label={t("reserveFlow.peopleStep.fields.phone.label")}
        required
        placeholder={t("reserveFlow.peopleStep.fields.phone.placeholder")}
        value={person.phone}
        onChange={(event) => handlePhoneChange(event.target.value)}
        disabled={disabled}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : undefined}
        className={cn(
          "xl:min-w-[12rem]",
          isReadOnly ? "pointer-events-none text-main-dark-green" : undefined
        )}
      />
      <TextInput
        label={t("reserveFlow.peopleStep.fields.birthDate.label")}
        required
        type="date"
        value={person.birthDate}
        onChange={(event) => handleChange("birthDate", event.target.value)}
        disabled={disabled}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : undefined}
        className={cn(
          "xl:min-w-[12rem]",
          isReadOnly
            ? "pointer-events-none text-main-dark-green"
            : undefined
        )}
      />
      <TextInput
        label={t("reserveFlow.peopleStep.fields.cpf.label")}
        required
        placeholder={t("reserveFlow.peopleStep.fields.cpf.placeholder")}
        value={person.cpf}
        onChange={(event) => handleCpfChange(event.target.value)}
        disabled={disabled}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : undefined}
        className={cn(
          "xl:min-w-[12rem]",
          isReadOnly ? "pointer-events-none text-main-dark-green" : undefined
        )}
      />
      {isReadOnly ? (
        <TextInput
          label={t("reserveFlow.peopleStep.fields.gender.label")}
          required
          value={
            person.gender && person.gender in genderOptions
              ? genderOptions[person.gender]
              : ""
          }
          readOnly
          tabIndex={-1}
          className={cn(
            "xl:min-w-[12rem] pointer-events-none text-main-dark-green"
          )}
        />
      ) : (
        <div className="flex flex-col gap-1 xl:min-w-[12rem]">
          <Label className="flex items-center gap-1 text-sm font-medium text-foreground">
            <span>{t("reserveFlow.peopleStep.fields.gender.label")}</span>
            <span>*</span>
          </Label>
          <Select
            value={person.gender}
            onValueChange={(value) =>
              handleChange(
                "gender",
                value as ReserveParticipantGender | ""
              )
            }
            disabled={isSelectDisabled}
          >
            <SelectTrigger
              size="default"
              className={cn(
                "h-12 border border-dark-gray/40 bg-soft-white text-sm",
                isSelectDisabled ? "opacity-80" : ""
              )}
            >
              <SelectValue
                placeholder={t(
                  "reserveFlow.peopleStep.fields.gender.placeholder"
                )}
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Object.entries(genderOptions).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value as ReserveParticipantGender}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
