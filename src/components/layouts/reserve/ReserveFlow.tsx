import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";

import { Button } from "@/components/button/defaultButton";
import { ReserveStepLayout } from "@/components/layouts/reserve/ReserveStepLayout";
import { PeopleRegistrationStep } from "@/components/layouts/reserve/PeopleRegistrationStep";
import { ExperienceAdjustmentsStep } from "@/components/layouts/reserve/ExperienceAdjustmentsStep";
import { appToast } from "@/components/toast/toast";
import { useCreateGroupReservation } from "@/hooks/useCreateGroupReservation";
import type { ExperienceTuningData } from "@/types/experience";
import type {
  GroupReservationParticipantPayload,
  ReservationAdjustmentPayload,
  ReservationExperiencePayload,
} from "@/api/reserve";
import type { ReserveParticipantDraft } from "@/types/reserve";
import type { NormalizedExperienceAdjustment } from "@/types/experience-adjustments";
import { useCartStore } from "@/store/cartStore";

import { digitsOnly, isValidCpf } from "@/lib/utils";
import { z } from "zod";

type PersonForm = ReserveParticipantDraft;
type StepId = 1 | 2;

function convertBrDateToIso(value: string): string {
  const trimmed = (value || "").trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);

  if (!match) return "";

  const [, dd, mm, yyyy] = match;
  const year = Number(yyyy);
  const month = Number(mm);
  const day = Number(dd);

  if (year < 1900 || year > new Date().getFullYear()) return "";
  if (month < 1 || month > 12) return "";

  const lastDay = new Date(year, month, 0).getDate();

  if (day < 1 || day > lastDay) return "";

  return `${yyyy}-${mm}-${dd}`;
}

function createEmptyPerson(): PersonForm {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return { id, name: "", phone: "", birthDate: "", cpf: "", gender: "" };
}

export function ReserveFlow() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [people, setPeople] = useState<PersonForm[]>([createEmptyPerson()]);
  const [allowPostConfirmation, setAllowPostConfirmation] = useState(false);
  const [notes, setNotes] = useState("");
  const [experienceAdjustments, setExperienceAdjustments] = useState<ExperienceTuningData[]>([]);
  const createReservation = useCreateGroupReservation();
  const isSubmitting = createReservation.isPending;
  const cartExperiences = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const hasExperiences = cartExperiences.length > 0;

  useEffect(() => {
    setExperienceAdjustments((prev) => {
      const filtered = prev.filter(
        (adjustment) =>
          adjustment.experienceId &&
          cartExperiences.some((experience) => experience.id === adjustment.experienceId)
      );

      return filtered.length === prev.length ? prev : filtered;
    });
  }, [cartExperiences]);

  const normalizedCartExperiences = useMemo<NormalizedExperienceAdjustment[]>(() => {
    if (!cartExperiences.length) {
      return [];
    }

    const resolveDate = (value?: string | null) => {
      if (!value) {
        return new Date();
      }
      const parsed = new Date(value);

      return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    };

    return cartExperiences.map((experience) => ({
      title: experience.name,
      price: typeof experience.price === "number" ? experience.price : 0,
      type:
        experience.category ?? t("reserveFlow.experienceStep.fallbackDefaults.type"),
      period: {
        start: resolveDate(experience.startDate ?? null),
        end: resolveDate(experience.endDate ?? null),
      },
      imageUrl: experience.image?.url ?? "/mock/landscape-1.jpg",
      experienceId: experience.id,
    }));
  }, [cartExperiences, t]);

  const participantSchema = useMemo(() => {
    const normalizeBirthToISO = (v: string): string => {
      const val = (v || "").trim();

      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val; // já ISO
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return convertBrDateToIso(val);

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
        .refine((s) => s.length > 0, t("validation.birthInvalid")),
      cpf: z
        .string()
        .transform((s) => digitsOnly(s))
        .refine((s) => isValidCpf(s), t("validation.cpfInvalid")),
      gender: z.enum(["FEMALE", "MALE", "OTHER", "NOT_INFORMED"] as const, {
        message: t("validation.genderRequired"),
      }),
    });
  }, [t]);

  type ParticipantSchemaOutput = z.infer<typeof participantSchema>;

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

  const isPersonValidBySchema = useCallback(
    (p: PersonForm) => participantSchema.safeParse(p).success,
    [participantSchema]
  );

  const isPersonPartial = (p: PersonForm) => isPersonStarted(p) && !isPersonValidBySchema(p);

  const canGoNextFromPeople = useMemo(() => {
    if (!hasExperiences) return false;
    if (allowPostConfirmation) return true;
    if (people.length === 0) return false;

    return people.every(isPersonValidBySchema);
  }, [allowPostConfirmation, hasExperiences, isPersonValidBySchema, people]);

  const firstIssueMessageFromZodErrors = useCallback(
    (err: z.ZodError<ParticipantSchemaOutput[]>): string => {
      const firstIssue = err.issues[0];
      const rawIndex = firstIssue?.path?.[0];
      const index = (typeof rawIndex === "number" ? rawIndex : 0) + 1;
      const message = firstIssue?.message ?? t("reserveFlow.validation.fillRequired");

      return t("reserveFlow.validation.personIssue", { index, message });
    },
    [t]
  );

  const validatePeopleOrToast = useCallback(
    (
      allowEmptyBecausePostConfirm: boolean
    ): { ok: true; value: GroupReservationParticipantPayload[] } | { ok: false } => {
      if (allowEmptyBecausePostConfirm) {
        const emptyParticipants: GroupReservationParticipantPayload[] = [];

  return { ok: true, value: emptyParticipants };
      }

      const parsed = peopleSchema.safeParse(people);

      if (!parsed.success) {
        appToast.error(firstIssueMessageFromZodErrors(parsed.error));

  return { ok: false };
      }

      const normalizedParticipants: GroupReservationParticipantPayload[] = parsed.data.map(
        (participant) => ({
          name: participant.name.trim(),
          phone: participant.phone,
          birthDate: participant.birthDate,
          cpf: participant.cpf,
          gender: participant.gender,
        })
      );

  return { ok: true, value: normalizedParticipants };
    },
    [firstIssueMessageFromZodErrors, people, peopleSchema]
  );

  const handleNextFromPeople = useCallback(() => {
    const res = validatePeopleOrToast(allowPostConfirmation);

    if (!res.ok) return;

    if (!hasExperiences) {
      appToast.error(t("reserveFlow.validation.noExperiences"));

      return;
    }

    goToStep(2);
  }, [allowPostConfirmation, goToStep, hasExperiences, t, validatePeopleOrToast]);

  const extractErrorMessage = useCallback((error: unknown): string | null => {
    if (isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string }
        | string
        | null
        | undefined;

      if (typeof data === "string" && data.trim().length > 0) {
        return data;
      }

      if (data && typeof data === "object" && typeof data.message === "string") {
        return data.message;
      }
    }

    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return null;
  }, []);

  const submitReservation = useCallback(async () => {
    const resValid = validatePeopleOrToast(allowPostConfirmation);

    if (!resValid.ok) {
      setCurrentStep(1);

      return;
    }

    if (!hasExperiences) {
      appToast.error(t("reserveFlow.validation.noExperiences"));
      setCurrentStep(1);

      return;
    }

    const adjustmentEntries: ReservationAdjustmentPayload[] = experienceAdjustments
      .filter(
        (adjustment): adjustment is ExperienceTuningData & { experienceId: string } =>
          typeof adjustment.experienceId === "string" && adjustment.experienceId.length > 0
      )
      .map((adjustment) => ({
        experienceId: adjustment.experienceId,
        men: adjustment.men,
        women: adjustment.women,
        from: adjustment.from,
        to: adjustment.to,
        savedAt: adjustment.savedAt,
      }));

    const adjustmentsById = new Map(adjustmentEntries.map((entry) => [entry.experienceId, entry]));

    const experiencesPayload: ReservationExperiencePayload[] = cartExperiences.map((experience) => ({
      experienceId: experience.id,
      adjustment: adjustmentsById.get(experience.id) ?? null,
    }));

    const adjustmentsPayload = Array.from(adjustmentsById.values());

    try {
      await createReservation.mutateAsync({
        allowPostConfirmation,
        notes: notes.trim(),
        participants: resValid.value,
        adjustments: adjustmentsPayload,
        experiences: experiencesPayload,
      });

      appToast.success(t("reserveFlow.toast.success"));
      setPeople([createEmptyPerson()]);
      setNotes("");
      setAllowPostConfirmation(false);
      setExperienceAdjustments([]);
      setCurrentStep(1);
      clearCart();
      void navigate({ to: "/reserve/summary" });
    } catch (error) {
      const message = extractErrorMessage(error);

      appToast.error(message ?? t("reserveFlow.toast.error"));
    }
  }, [
    allowPostConfirmation,
    cartExperiences,
    clearCart,
    createReservation,
    experienceAdjustments,
    extractErrorMessage,
    hasExperiences,
    navigate,
    notes,
    t,
    validatePeopleOrToast,
  ]);

  const footer = useMemo(() => {
    if (currentStep === 1) {
      return [
        <Button
          key="back"
          label={t("common.back")}
          variant="ghost"
          onClick={() => {
            void navigate({ to: "/" });
          }}
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
        onClick={() => {
          void submitReservation();
        }}
        disabled={isSubmitting || !hasExperiences}
        className="sm:w-auto"
      />,
    ];
  }, [
    currentStep,
    goToStep,
    hasExperiences,
    isSubmitting,
    navigate,
    t,
    handleNextFromPeople,
    canGoNextFromPeople,
    submitReservation,
  ]);

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
          disabled={isSubmitting}
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
          experiences={normalizedCartExperiences}
        />
      )}
    </ReserveStepLayout>
  );
}