import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/defaultButton";
import { ReserveStepLayout } from "@/components/layouts/reserve/ReserveStepLayout";
import { PeopleRegistrationStep } from "@/components/layouts/reserve/PeopleRegistrationStep";
import { ExperienceAdjustmentsStep } from "@/components/layouts/reserve/ExperienceAdjustmentsStep";
import { appToast } from "@/components/toast/toast";

type PersonForm = {
  id: string;
  name: string;
  phone: string;
  birthDate: string;
  cpf: string;
  gender: string;
};

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

export function ReserveFlow() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [people, setPeople] = useState<PersonForm[]>([createEmptyPerson()]);
  const [allowPostConfirmation, setAllowPostConfirmation] = useState(false);
  const [notes, setNotes] = useState("");

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
          onClick={() => goToStep(2)}
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
          appToast.success(t("reserveFlow.toast.success"));
        }}
        className="sm:w-auto"
      />,
    ];
  }, [currentStep, goToStep, navigate, t]);

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

      if (indexToRemove === -1) {
        return prev;
      }

      return [
        ...prev.slice(0, indexToRemove),
        ...prev.slice(indexToRemove + 1),
      ];
    });
  };

  const handleToggleAllowPostConfirmation = (value: boolean) => {
    setAllowPostConfirmation(value);

    if (value) {
      setPeople([createEmptyPerson()]);
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
        <ExperienceAdjustmentsStep />
      )}
    </ReserveStepLayout>
  );
}
