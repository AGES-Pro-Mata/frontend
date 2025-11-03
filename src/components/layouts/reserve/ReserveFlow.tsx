import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/button/defaultButton";
import { ReserveStepLayout } from "@/components/layouts/reserve/ReserveStepLayout";
import { PeopleRegistrationStep } from "@/components/layouts/reserve/PeopleRegistrationStep";
import { ExperienceAdjustmentsStep } from "@/components/layouts/reserve/ExperienceAdjustmentsStep";
import { appToast } from "@/components/toast/toast";
import type { ReserveParticipantDraft } from "@/types/reserve";

import { digitsOnly, isValidCpf, toIsoFromBR } from "@/lib/utils";
import { z } from "zod";

type PersonForm = ReserveParticipantDraft;
type StepId = 1 | 2;

function createEmptyPerson(): PersonForm {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return { id, name: "", phone: "", birthDate: "", cpf: "", gender: "" };
}

export function ReserveFlow() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [people, setPeople] = useState<PersonForm[]>([createEmptyPerson()]);
  const [allowPostConfirmation, setAllowPostConfirmation] = useState(false);
  const [notes, setNotes] = useState("");
  const [experienceAdjustments, setExperienceAdjustments] = useState<any>(null);

  const participantSchema = useMemo(() => {
    const normalizeBirthToISO = (v: string) => {
      const val = (v || "").trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val; // já ISO
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return toIsoFromBR(val);
      return "";
    };

    return z.object({
      name: z.string().trim().min(2, t("validation.nameTooShort")),
      phone: z
        .string()
        .transform((s) => digitsOnly(s))
        .refine((s) => s.length >= 10, t("validation.phoneInvalid")),
      birthDate: z
        .string()
        .transform(normalizeBirthToISO)
        .refine((s) => !!s, t("validation.birthInvalid")),
      cpf: z
        .string()
        .transform((s) => digitsOnly(s))
        .refine((s) => isValidCpf(s), t("validation.cpfInvalid")),
      gender: z.enum(["FEMALE", "MALE", "OTHER", "NOT_INFORMED"], {
        errorMap: () => ({ message: t("validation.genderRequired") }),
      }),
    });
  }, [i18n.language, t]);

  const peopleSchema = useMemo(
    () => z.array(participantSchema).min(1, t("reserveFlow.validation.fillRequired")),
    [participantSchema, t]
  );

  const steps = useMemo(
    () => [
      {
        id: 1 as StepId,
        title: t("reserveFlow.steps.people.title"),
        description: t("reserveFlow.steps.people.description"),
        subtitle: t("reserveFlow.steps.people.subtitle"),
      },
      {
        id: 2 as StepId,
        title: t("reserveFlow.steps.experiences.title"),
        description: t("reserveFlow.steps.experiences.description"),
        subtitle: t("reserveFlow.steps.experiences.subtitle"),
      },
    ],
    [t]
  );
  const totalSteps = steps.length;
  const activeStep = steps[currentStep - 1];

  const goToStep = useCallback((step: StepId) => setCurrentStep(step), []);

  const isPersonStarted = (p: PersonForm) =>
    (p.name || p.phone || p.birthDate || p.cpf || p.gender || "")
      .toString()
      .trim() !== "";

  const isPersonValidBySchema = (p: PersonForm) =>
    participantSchema.safeParse(p).success;

  const isPersonPartial = (p: PersonForm) => isPersonStarted(p) && !isPersonValidBySchema(p);

  const canGoNextFromPeople = useMemo(() => {
    if (allowPostConfirmation) return true;
    if (people.length === 0) return false;
    return people.every(isPersonValidBySchema);
  }, [allowPostConfirmation, people, participantSchema]);

  function firstIssueMessageFromZodErrors(err: z.ZodError): string {
    const first = err.errors[0];
    const pathIndex = typeof first?.path?.[0] === "number" ? (first.path[0] as number) : 0;
    const index = pathIndex + 1;
    const msg = first?.message || t("reserveFlow.validation.fillRequired");
    return t("reserveFlow.validation.personIssue", { index, message: msg });
  }

  const validatePeopleOrToast = (allowEmptyBecausePostConfirm: boolean) => {
    if (allowEmptyBecausePostConfirm) return { ok: true, value: [] as any[] };
    const parsed = peopleSchema.safeParse(people);
    if (!parsed.success) {
      appToast.error(firstIssueMessageFromZodErrors(parsed.error));
      return { ok: false as const };
    }
    return { ok: true as const, value: parsed.data };
  };

  const handleNextFromPeople = () => {
    const res = validatePeopleOrToast(allowPostConfirmation);
    if (!res.ok) return;

    console.log("Dados salvos:", {
      participants: allowPostConfirmation ? [] : res.value,
      notes,
      allowPostConfirmation,
    });

    goToStep(2);
  };

  const submitReservation = async () => {
    try {
      const resValid = validatePeopleOrToast(allowPostConfirmation);
      if (!resValid.ok) {
        setCurrentStep(1);
        return;
      }

      const participants = allowPostConfirmation
        ? []
        : resValid.value.map((p) => ({
            name: p.name.trim(),
            phone: p.phone,
            birthDate: p.birthDate,
            cpf: p.cpf,
            gender: p.gender,
          }));

      const payload = {
        allowPostConfirmation,
        notes: notes?.trim() || "",
        participants,
        adjustments: experienceAdjustments,
      };

      const res = await fetch("/reservation/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Request failed");
      }

      appToast.success(t("reserveFlow.toast.success"));
      navigate({ to: "/reserve/summary" });
    } catch (err) {
      console.error(err);
      appToast.error(t("reserveFlow.toast.error"));
    }
  };

  const footer = useMemo(() => {
    if (currentStep === 1) {
      return [
        <Button
          key="back"
          label={t("common.back")}
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="sm:w-auto"
        />,
        <Button
          key="next"
          label={t("common.next")}
          onClick={handleNextFromPeople}
          disabled={!canGoNextFromPeople}
          className="sm:w-auto"
        />,
      ];
    }

    return [
      <Button
        key="back"
        label={t("common.back")}
        variant="ghost"
        onClick={() => goToStep(1)}
        className="sm:w-auto"
      />,
      <Button
        key="finish"
        label={t("common.finish")}
        onClick={submitReservation}
        className="sm:w-auto"
      />,
    ];
  }, [currentStep, goToStep, navigate, t, handleNextFromPeople, canGoNextFromPeople]);

  const handlePersonChange = <K extends keyof PersonForm>(
    personId: string,
    field: K,
    value: PersonForm[K]
  ) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === personId ? { ...person, [field]: value } : person
      )
    );
  };

  const handleAddPerson = () => setPeople((prev) => [...prev, createEmptyPerson()]);

  const handleRemovePerson = (personId: string) => {
    setPeople((prev) => {
      if (prev.length === 1) return prev;
      const indexToRemove = prev.findIndex((person) => person.id === personId);
      if (indexToRemove === -1) return prev;
      return [...prev.slice(0, indexToRemove), ...prev.slice(indexToRemove + 1)];
    });
  };

  const handleToggleAllowPostConfirmation = (value: boolean) => {
    if (value) {
      const hasPartial = people.some(isPersonPartial);
      if (hasPartial) {
        const parsed = peopleSchema.safeParse(people);
        if (!parsed.success) appToast.error(firstIssueMessageFromZodErrors(parsed.error));
        return;
      }
      setAllowPostConfirmation(true);
    } else {
      setAllowPostConfirmation(false);
    }
  };

  return (
    <ReserveStepLayout
      title={activeStep.title}
      subtitle={activeStep.subtitle}
      description={activeStep.description}
      currentStep={currentStep}
      totalSteps={totalSteps}
      footer={footer}
    >
      {currentStep === 1 ? (
        <PeopleRegistrationStep
          people={people}
          allowPostConfirmation={allowPostConfirmation}
          notes={notes}
          onPersonChange={handlePersonChange}
          onAddPerson={handleAddPerson}
          onRemovePerson={handleRemovePerson}
          onToggleAllowPostConfirmation={handleToggleAllowPostConfirmation}
          onNotesChange={setNotes}
        />
      ) : (
        <ExperienceAdjustmentsStep
          onChange={setExperienceAdjustments}
          value={experienceAdjustments}
        />
      )}
    </ReserveStepLayout>
  );
}