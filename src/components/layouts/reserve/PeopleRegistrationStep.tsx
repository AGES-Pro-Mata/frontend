import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import CanvasCard from "@/components/card/canvasCard";
import { Button } from "@/components/button/defaultButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/typography/typography";
import { ReserveParticipantInputs } from "@/components/layouts/reserve/ReserveParticipantInputs";
import type { ReserveParticipantDraft } from "@/types/reserve";

type PersonForm = ReserveParticipantDraft;

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
              <ReserveParticipantInputs
                className="mt-5"
                person={person}
                disabled={shouldDisableForms}
                onFieldChange={(field, value) =>
                  onPersonChange(person.id, field, value)
                }
              />
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
