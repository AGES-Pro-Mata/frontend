import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";

import { Button } from "@/components/button/defaultButton";
import { ReserveStepLayout } from "@/components/layouts/reserve/ReserveStepLayout";
import { PeopleRegistrationStep } from "@/components/card/reservePeopleRegistrationCard";
import { ExperienceAdjustmentsStep } from "@/components/card/experienceAdjustmentsStepCard";
import { appToast } from "@/components/toast/toast";
import type { ExperienceTuningData } from "@/types/experience";
import type {
  GroupReservationParticipantPayload,
  ReservationAdjustmentPayload,
  ReservationPayload,
} from "@/api/reserve";
import type {
  ReserveParticipant,
  ReserveParticipantDraft,
  ReserveSummaryExperience,
} from "@/types/reserve";
import type { NormalizedExperienceAdjustment } from "@/types/experience-adjustments";
import { useCartStore } from "@/store/cartStore";
import { useReservationSummaryStore } from "@/store/reservationSummaryStore";
import { translateExperienceCategory } from "@/utils/translateExperienceCategory";
import { digitsOnly, isValidCpf, maskCpf, maskPhone } from "@/lib/utils";
import { z } from "zod";
import { getCurrentUserRequest } from "@/api/user";
import { useCreateGroupReservation } from "@/hooks";

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

  return { id, name: "", phone: "", birthDate: "", document: "", gender: "" };
}

function toNonNegativeNumber(value: unknown): number {
  const parsed = Number(value ?? 0);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function ReserveFlow() {
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
  const setReservationSummary = useReservationSummaryStore((state) => state.setSummary);
  const hasExperiences = cartExperiences.length > 0;

  useEffect(() => {
    setExperienceAdjustments((prev) => {
      const filtered = prev.filter(
        (adjustment) =>
          adjustment.experienceId &&
          cartExperiences.some((experience) => experience.id === adjustment.experienceId),
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

    const resolvePrice = (value: unknown) => {
      const numeric = Number(value ?? 0);

      return Number.isFinite(numeric) ? numeric : 0;
    };

    return cartExperiences.map((experience) => ({
      title: experience.name,
      price: resolvePrice(experience.price),
      type: translateExperienceCategory(
        experience.category,
        t,
        t("reserveFlow.experienceStep.fallbackDefaults.type"),
      ),
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

      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
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
      document: z
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
    [participantSchema, t],
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
    [t],
  );
  const totalSteps = steps.length;
  const activeStep = steps[currentStep - 1];

  const goToStep = useCallback((step: StepId) => setCurrentStep(step), []);

  const isPersonStarted = (p: PersonForm) =>
    (p.name || p.phone || p.birthDate || p.document || p.gender || "").toString().trim() !== "";

  const isPersonValidBySchema = useCallback(
    (p: PersonForm) => participantSchema.safeParse(p).success,
    [participantSchema],
  );

  const participantGenderStats = useMemo(() => {
    if (allowPostConfirmation) {
      return { male: 0, female: 0, total: 0 };
    }

    return people.reduce(
      (acc, person) => {
        if (!isPersonValidBySchema(person)) {
          return acc;
        }

        const gender = (person.gender ?? "").toUpperCase();

        if (gender === "FEMALE") {
          acc.female += 1;
        } else if (["MALE", "OTHER", "NOT_INFORMED"].includes(gender)) {
          acc.male += 1;
        }

        acc.total = acc.male + acc.female;

        return acc;
      },
      { male: 0, female: 0, total: 0 },
    );
  }, [allowPostConfirmation, isPersonValidBySchema, people]);

  const hasRegisteredParticipants = participantGenderStats.total > 0;

  const experienceRequirementsMet = useMemo(() => {
    if (!normalizedCartExperiences.length) {
      return false;
    }

    return normalizedCartExperiences.every((experience) => {
      if (!experience.experienceId) {
        return false;
      }

      const adjustment = experienceAdjustments.find(
        (item) => item.experienceId === experience.experienceId,
      );

      if (!adjustment) {
        return false;
      }

      const men = toNonNegativeNumber(adjustment.men);
      const women = toNonNegativeNumber(adjustment.women);
      const total = men + women;

      if (total < 1) {
        return false;
      }

      if (hasRegisteredParticipants) {
        if (men < participantGenderStats.male) {
          return false;
        }

        if (women < participantGenderStats.female) {
          return false;
        }
      }

      return true;
    });
  }, [
    experienceAdjustments,
    hasRegisteredParticipants,
    normalizedCartExperiences,
    participantGenderStats,
  ]);

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
    [t],
  );

  const validatePeopleOrToast = useCallback(
    (
      allowEmptyBecausePostConfirm: boolean,
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
          cpf: participant.document,
          document: participant.document,
          gender: participant.gender,
        }),
      );

      return { ok: true, value: normalizedParticipants };
    },
    [firstIssueMessageFromZodErrors, people, peopleSchema],
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
      const data = error.response?.data as { message?: string } | string | null | undefined;

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
          typeof adjustment.experienceId === "string" && adjustment.experienceId.length > 0,
      )
      .map((adjustment) => ({
        experienceId: adjustment.experienceId,
        men: toNonNegativeNumber(adjustment.men),
        women: toNonNegativeNumber(adjustment.women),
        from: adjustment.from,
        to: adjustment.to,
        savedAt: adjustment.savedAt,
      }));

    const adjustmentsById = new Map(adjustmentEntries.map((entry) => [entry.experienceId, entry]));

    const normalizeDateString = (value?: string | Date | null) => {
      if (!value) return null;

      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value.toISOString();
      }

      if (typeof value === "string") {
        const trimmed = value.trim();

        return trimmed.length > 0 ? trimmed : null;
      }

      return null;
    };

    const reservationsPayload: ReservationPayload[] = [];
    const summaryExperiences: ReserveSummaryExperience[] = [];

    for (const experience of cartExperiences) {
      const adjustment = adjustmentsById.get(experience.id);
      const rawTitle = (experience.name ?? "").trim();
      const experienceTitle = rawTitle.length
        ? rawTitle
        : t("reserveFlow.validation.unknownExperience");

      const startDate = normalizeDateString(adjustment?.from ?? experience.startDate ?? null);
      const endDate = normalizeDateString(adjustment?.to ?? experience.endDate ?? null);

      if (!startDate || !endDate) {
        appToast.error(
          t("reserveFlow.validation.missingExperienceDates", {
            title: experienceTitle,
          }),
        );
        setCurrentStep(2);

        return;
      }

      if (!adjustment) {
        appToast.error(
          t("reserveFlow.validation.invalidExperienceParticipants", {
            title: experienceTitle,
          }),
        );
        setCurrentStep(2);

        return;
      }

      const menCount = toNonNegativeNumber(adjustment.men);
      const womenCount = toNonNegativeNumber(adjustment.women);
      const membersCount = menCount + womenCount;

      if (membersCount < 1) {
        appToast.error(
          t("reserveFlow.validation.invalidExperienceParticipants", {
            title: experienceTitle,
          }),
        );
        setCurrentStep(2);

        return;
      }

      if (hasRegisteredParticipants) {
        if (menCount < participantGenderStats.male || womenCount < participantGenderStats.female) {
          appToast.error(
            t("reserveFlow.validation.invalidExperienceParticipants", {
              title: experienceTitle,
            }),
          );
          setCurrentStep(2);

          return;
        }
      }

      reservationsPayload.push({
        experienceId: experience.id,
        startDate,
        endDate,
        membersCount,
        adjustments: [adjustment],
      });

      const priceValue = Number(experience.price ?? 0);

      summaryExperiences.push({
        title: experienceTitle,
        startDate,
        endDate,
        price: Number.isFinite(priceValue) ? priceValue : 0,
        peopleCount: membersCount,
        imageUrl: experience.image?.url ?? "/mock/landscape-1.jpg",
      });
    }

    const summaryParticipants: ReserveParticipant[] = allowPostConfirmation
      ? []
      : resValid.value.map((participant, index) => {
          const fallbackId = people[index]?.id ?? `${participant.document}-${index}`;

          return {
            id: fallbackId,
            name: participant.name.trim(),
            phone: maskPhone(participant.phone),
            birthDate: participant.birthDate,
            document: maskCpf(participant.document),
            gender: participant.gender,
          };
        });

    const normalizedNotes = notes.trim();

    try {
      await createReservation.mutateAsync({
        allowPostConfirmation,
        notes: normalizedNotes,
        members: resValid.value,
        reservations: reservationsPayload,
      });

      setReservationSummary({
        participants: summaryParticipants,
        experiences: summaryExperiences,
        notes: normalizedNotes,
      });

      appToast.success(t("reserveFlow.toast.success"));
      setPeople([createEmptyPerson()]);
      setNotes("");
      setAllowPostConfirmation(false);
      setExperienceAdjustments([]);
      setCurrentStep(1);
      clearCart();
      void navigate({ to: "/reserve/finish/summary" });
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
    hasRegisteredParticipants,
    navigate,
    notes,
    participantGenderStats,
    people,
    setReservationSummary,
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
        disabled={isSubmitting || !hasExperiences || !experienceRequirementsMet}
        className="sm:w-auto"
      />,
    ];
  }, [
    currentStep,
    experienceRequirementsMet,
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
    value: PersonForm[K],
  ) => {
    setPeople((prev) =>
      prev.map((person) => (person.id === personId ? { ...person, [field]: value } : person)),
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

export const Route = createFileRoute("/(index)/reserve/finish/")({
  component: ReserveFlow,
  beforeLoad: async () => {
    // Verificar se o usuário está autenticado
    const currentUser = await getCurrentUserRequest();
    
    if (!currentUser) {
      appToast.error("Você deve logar primeiro para criar uma reserva");
      throw redirect({ 
        to: "/auth/login",
        search: { redirect: "/reserve/finish" }
      });
    }

    // Verificar se o carrinho tem itens
    const cartState = useCartStore.getState();

    if (!cartState.items || cartState.items.length === 0) {
      appToast.error("Seu carrinho está vazio. Adicione experiências antes de finalizar a reserva.");
      throw redirect({ to: "/" });
    }
  },
});
