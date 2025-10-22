import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/defaultButton";
import { ReserveStepLayout } from "@/components/layouts/reserve/ReserveStepLayout";
import { PeopleRegistrationStep } from "@/components/layouts/reserve/PeopleRegistrationStep";
import { ExperienceAdjustmentsStep } from "@/components/layouts/reserve/ExperienceAdjustmentsStep";
import { appToast } from "@/components/toast/toast";
import type { ReserveParticipantDraft } from "@/types/reserve";

import { isValidCpf, digitsOnly } from "@/lib/utils";

type PersonForm = ReserveParticipantDraft;

function createEmptyPerson(): PersonForm {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    name: "",
    phone: "",
    birthDate: "",
    cpf: "",
    gender: "",
  };
}

type StepId = 1 | 2;

/** Helpers para data (aceita BR dd/mm/aaaa ou ISO aaaa-mm-dd) */
function toIsoIfPossible(value: string) {
  const v = (value || "").trim();

  // ISO direto: yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-").map(Number);
    if (y < 1900 || y > new Date().getFullYear()) return "";
    if (m < 1 || m > 12) return "";
    const lastDay = new Date(y, m, 0).getDate();
    if (d < 1 || d > lastDay) return "";
    return v;
  }

  // BR: dd/mm/yyyy
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const y = Number(yyyy), mo = Number(mm), d = Number(dd);
    if (y < 1900 || y > new Date().getFullYear()) return "";
    if (mo < 1 || mo > 12) return "";
    const lastDay = new Date(y, mo, 0).getDate();
    if (d < 1 || d > lastDay) return "";
    return `${yyyy}-${mm}-${dd}`;
  }

  return "";
}

function isValidBirthDate(value: string) {
  return toIsoIfPossible(value) !== "";
}

function isPersonStarted(p: PersonForm) {
  return (
    (p.name || "").trim() !== "" ||
    (p.phone || "").trim() !== "" ||
    (p.birthDate || "").trim() !== "" ||
    (p.cpf || "").trim() !== "" ||
    (p.gender || "").trim() !== ""
  );
}

function isPersonValid(p: PersonForm) {
  const nameOk = (p.name || "").trim().length > 1;
  const phoneOk = digitsOnly(p.phone || "").length >= 10;
  const birthOk = isValidBirthDate(p.birthDate || ""); // agora valida conteúdo
  const genderOk = (p.gender || "").trim().length > 0;
  const cpfOk = isValidCpf(p.cpf || "");
  return nameOk && phoneOk && birthOk && genderOk && cpfOk;
}

function isPersonPartial(p: PersonForm) {
  return isPersonStarted(p) && !isPersonValid(p);
}

function getPersonIssues(p: PersonForm, t: (k: string, o?: any) => string) {
  const issues: string[] = [];
  const name = (p.name || "").trim();
  const phoneDigits = digitsOnly(p.phone || "");
  const birth = (p.birthDate || "").trim();
  const cpf = (p.cpf || "").trim();
  const gender = (p.gender || "").trim();

  if (name.length === 0) issues.push(t("validation.nameRequired"));
  else if (name.length <= 1) issues.push(t("validation.nameTooShort"));

  if (phoneDigits.length === 0) issues.push(t("validation.phoneRequired"));
  else if (phoneDigits.length < 10) issues.push(t("validation.phoneInvalid"));

  if (birth.length === 0) {
    issues.push(t("validation.birthRequired"));
  } else if (!isValidBirthDate(birth)) {
    issues.push(t("validation.birthInvalid"));
  }

  if (cpf.length === 0) issues.push(t("validation.cpfInvalid"));
  else if (!isValidCpf(cpf)) issues.push(t("validation.cpfInvalid"));

  if (gender.length === 0) issues.push(t("validation.genderRequired"));

  return issues;
}

function formatFirstIssueForToast(
  people: PersonForm[],
  t: (k: string, o?: any) => string
) {
  for (let i = 0; i < people.length; i++) {
    const p = people[i];
    if (!isPersonStarted(p)) continue;
    const issues = getPersonIssues(p, t).filter(Boolean);
    if (issues.length > 0) {
      return t("reserveFlow.validation.personIssue", {
        index: i + 1,
        message: issues[0],
      });
    }
  }
  return t("reserveFlow.validation.fillRequired");
}

export function ReserveFlow() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [people, setPeople] = useState<PersonForm[]>([createEmptyPerson()]);
  const [allowPostConfirmation, setAllowPostConfirmation] = useState(false);
  const [notes, setNotes] = useState("");

  const [experienceAdjustments, setExperienceAdjustments] = useState<any>(null);

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

  const goToStep = useCallback((step: StepId) => {
    setCurrentStep(step);
  }, []);

  const canGoNextFromPeople = useMemo(() => {
    if (allowPostConfirmation) return true;
    if (people.length === 0) return false;
    return people.every(isPersonValid);
  }, [allowPostConfirmation, people]);

  const handleNextFromPeople = () => {
    if (!canGoNextFromPeople) {
      const msg = formatFirstIssueForToast(people, t);
      appToast.error(msg);
      return;
    }

    goToStep(2);
  };

  const submitReservation = async () => {
    try {
      if (!allowPostConfirmation) {
        if (people.length === 0 || !people.every(isPersonValid)) {
          const msg = formatFirstIssueForToast(people, t);
          appToast.error(msg);
          setCurrentStep(1);
          return;
        }
      }

      const payload = {
        allowPostConfirmation,
        notes: notes?.trim() || "",
        participants: allowPostConfirmation
          ? []
          : people.map((p) => ({
              name: (p.name || "").trim(),
              phone: digitsOnly(p.phone || ""),
              birthDate: toIsoIfPossible(p.birthDate || "") || "", // envia ISO
              cpf: digitsOnly(p.cpf || ""),
              gender: p.gender,
            })),
        adjustments: experienceAdjustments,
      };

      const res = await fetch("/api/reservations", {
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
  }, [
    currentStep,
    goToStep,
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
        person.id === personId
          ? {
              ...person,
              [field]: value,
            }
          : person
      )
    );
  };

  const handleAddPerson = () => {
    setPeople((prev) => [...prev, createEmptyPerson()]);
  };

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
        const msg = formatFirstIssueForToast(people, t);
        appToast.error(msg);
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
