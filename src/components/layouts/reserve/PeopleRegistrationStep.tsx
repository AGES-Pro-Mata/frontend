import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import CanvasCard from "@/components/cards/canvasCard";
import { Button } from "@/components/buttons/defaultButton";
import { TextInput } from "@/components/inputs/textInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/typography/typography";
import { cn, digitsOnly, maskCpf, maskPhone } from "@/lib/utils";

type PersonForm = {
  id: string;
  name: string;
  phone: string;
  birthDate: string;
  cpf: string;
  gender: string;
};

type PeopleRegistrationStepProps = {
  people: PersonForm[];
  disabled?: boolean;
  allowPostConfirmation: boolean;
  notes: string;
  onPersonChange: <K extends keyof PersonForm>(
    personId: string,
    field: K,
    value: PersonForm[K]
  ) => void;
  onAddPerson: () => void;
  onRemovePerson: (personId: string) => void;
  onToggleAllowPostConfirmation: (checked: boolean) => void;
  onNotesChange: (value: string) => void;
};

export function PeopleRegistrationStep({
  people,
  disabled = false,
  allowPostConfirmation,
  notes,
  onPersonChange,
  onAddPerson,
  onRemovePerson,
  onToggleAllowPostConfirmation,
  onNotesChange,
}: PeopleRegistrationStepProps) {
  const { t } = useTranslation();
  const shouldDisableForms = disabled || allowPostConfirmation;

  const genderOptions = useMemo(
    () => [
      { value: "FEMALE", label: t("reserveFlow.peopleStep.genderOptions.female") },
      { value: "MALE", label: t("reserveFlow.peopleStep.genderOptions.male") },
      { value: "OTHER", label: t("reserveFlow.peopleStep.genderOptions.other") },
      {
        value: "NOT_INFORMED",
        label: t("reserveFlow.peopleStep.genderOptions.notInformed"),
      },
    ],
    [t]
  );

  const addButtonLabel = useMemo(
    () => (
      <span className="flex items-center gap-2 font-semibold">
        <Plus className="h-4 w-4" />
        {t("reserveFlow.peopleStep.buttons.addPerson")}
      </span>
    ),
    [t]
  );

  return (
    <CanvasCard className="w-full border border-dark-gray/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <Typography className="text-sm text-foreground">
          {t("reserveFlow.peopleStep.instructions")}
        </Typography>

        <div className="flex flex-col gap-5">
          {people.map((person, index) => (
            <section
              key={person.id}
              className="rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs"
            >
              <header className="flex justify-end">
                {people.length > 1 && !shouldDisableForms && (
                  <Button
                    variant="ghost"
                    size="icon"
                    label={<Trash2 className="h-5 w-5" />}
                    onClick={() => onRemovePerson(person.id)}
                    aria-label={t("reserveFlow.peopleStep.buttons.removePersonAria", {
                      index: index + 1,
                    })}
                    className="ml-auto text-default-red hover:bg-default-red/10"
                  />
                )}
              </header>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <TextInput
                  label={t("reserveFlow.peopleStep.fields.name.label")}
                  required
                  placeholder={t("reserveFlow.peopleStep.fields.name.placeholder")}
                  value={person.name}
                  onChange={(event) =>
                    onPersonChange(person.id, "name", event.target.value)
                  }
                  disabled={shouldDisableForms}
                  className="xl:min-w-[12rem]"
                />
                <TextInput
                  label={t("reserveFlow.peopleStep.fields.phone.label")}
                  required
                  placeholder={t("reserveFlow.peopleStep.fields.phone.placeholder")}
                  value={person.phone}
                  onChange={(event) => {
                    const digits = digitsOnly(event.target.value).slice(0, 11);
                    onPersonChange(person.id, "phone", maskPhone(digits));
                  }}
                  disabled={shouldDisableForms}
                  className="xl:min-w-[12rem]"
                />
                <TextInput
                  label={t("reserveFlow.peopleStep.fields.birthDate.label")}
                  required
                  type="date"
                  value={person.birthDate}
                  onChange={(event) =>
                    onPersonChange(person.id, "birthDate", event.target.value)
                  }
                  disabled={shouldDisableForms}
                  className="xl:min-w-[12rem]"
                />
                <TextInput
                  label={t("reserveFlow.peopleStep.fields.cpf.label")}
                  required
                  placeholder={t("reserveFlow.peopleStep.fields.cpf.placeholder")}
                  value={person.cpf}
                  onChange={(event) => {
                    const digits = digitsOnly(event.target.value).slice(0, 11);
                    onPersonChange(person.id, "cpf", maskCpf(digits));
                  }}
                  disabled={shouldDisableForms}
                  className="xl:min-w-[12rem]"
                />
                <div className="flex flex-col gap-1 xl:min-w-[12rem]">
                  <Label className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <span>{t("reserveFlow.peopleStep.fields.gender.label")}</span>
                    <span>*</span>
                  </Label>
                  <Select
                    value={person.gender}
                    onValueChange={(value) =>
                      onPersonChange(person.id, "gender", value)
                    }
                    disabled={shouldDisableForms}
                  >
                    <SelectTrigger
                      size="default"
                      className={cn(
                        "h-12 border border-dark-gray/40 bg-soft-white text-sm",
                        shouldDisableForms ? "opacity-80" : ""
                      )}
                    >
                      <SelectValue
                        placeholder={t(
                          "reserveFlow.peopleStep.fields.gender.placeholder"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          label={addButtonLabel}
          onClick={onAddPerson}
          disabled={shouldDisableForms}
          className="w-full justify-center border-2 border-dashed border-main-dark-green bg-white py-4 text-main-dark-green hover:bg-main-dark-green/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <section className="flex flex-col gap-4 rounded-2xl border border-dark-gray/20 bg-soft-white p-5 shadow-xs">
          <Label htmlFor="post-confirmation" className="gap-3 text-sm font-medium text-foreground">
            <Checkbox
              id="post-confirmation"
              checked={allowPostConfirmation}
              onCheckedChange={(checked) =>
                onToggleAllowPostConfirmation(checked === true)
              }
            />
            <span className="select-none">
              {t("reserveFlow.peopleStep.postConfirmation.label")}
            </span>
          </Label>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reservation-notes" className="text-sm font-medium">
              {t("reserveFlow.peopleStep.notes.label")}
            </Label>
            <Textarea
              id="reservation-notes"
              placeholder={t("reserveFlow.peopleStep.notes.placeholder")}
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              disabled={shouldDisableForms}
              className="min-h-[140px] resize-vertical border-dark-gray/40 bg-white"
            />
          </div>
        </section>
      </div>
    </CanvasCard>
  );
}
