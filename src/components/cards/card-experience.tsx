import { Button } from "@/components/buttons/defaultButton";
import type { Experience } from "@/types/experiences";
// import Map from "/card-experience-icons/map-icon.svg";
import {Map, DollarSign, Timer, CalendarClock, User} from "lucide-react"
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";


interface CardExperienceProps {
  experience: Experience;
}

export function CardExperience({ experience }: CardExperienceProps) {
  const { t } = useTranslation();
  console.log(experience.capacity);
  const labelConfig = {
    lab: [
      {
        icon: User,
        text: t("reserveSummary.experiences.peopleCount", {
          count: Number(experience.capacity ?? 0),
        }),
      },
      { icon: DollarSign, text: `R$ ${experience.price}` },
    ],
    trail: [
      { icon: Map, text: `${experience.trailLength} km` },
      { icon: Timer, text: `${experience.trailDurationMinutes} min` },
    ],
    event: [
      {
        icon: CalendarClock,
        text: new Date(experience.startDate).toLocaleDateString(),
      },
      { icon: DollarSign, text: `R$ ${experience.price}` },
    ],
    room: [
      {
        icon: User,
        text: t("reserveSummary.experiences.peopleCount", {
          count: Number(experience.capacity ?? 0),
        }),
      },
      { icon: DollarSign, text: `R$ ${experience.price}` },
    ],
  };

  const labels = labelConfig[experience.category] ?? [];
  const category = t(`homeCards.${experience.category.toLowerCase() + "s"}.title`);

  return (
    <div className="bg-card w-[450px] h-[400px] flex justify-center relative rounded-[20px] overflow-hidden">
      <img
        src={`./mock/mock-${experience.category}.png`}
        className="flex h-[50%] w-[90%] object-cover mx-[15px] mt-[20px] box-border rounded-[15px]"
      />
      <div className="flex flex-col absolute justify-between bg-card h-[50%] w-full top-[200px] px-[15px] py-[15px] gap-[5px] shadow-[0_0px_12px_rgba(0,0,0,0.8)] z-[50]">
        <div className="flex flex-row gap-[10px] w-full flex-1">
          <div className="flex flex-col flex-1">
            <div className="flex flex-row items-center justify-start gap-[20px]">
              <h3 className="font-bold leading-none flex p-0 m-0 text-[16px] text-[var(--color-main-dark-green)]">
                {experience.name}
                <span className="capitalize h-fit flex w-fit leading-none items-center text-[10px] ml-[10px] text-[var(--color-on-banner-text)] bg-banner)] py-[4px] px-[12px] rounded-[30px] shadow-[inset_0_0px_2px_1px_rgba(0,0,0,0.3)]">
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).toLowerCase()}
                </span>
              </h3>
            </div>
            <p className="mt-[4px] text-[14px] p-0 m-0 h-[100px] overflow-y-auto text-[var(--color-dark-gray)] scrollbar-hide font-semibold">
              {experience.description}
            </p>
          </div>
          <div className="flex w-[30%] flex-col gap-[15px]">
            {labels.map(({ icon: Icon, text }, idx) => (
              <div
                key={idx}
                className="flex flex-row bg-card-labels shadow-[inset_0_0px_3px_1px_rgba(0,0,0,0.6)] rounded-[30px] items-center gap-2"
              >
                <Icon className="w-auto h-[28px] bg-main-dark-green rounded-[100px] p-[5px] text-white" />
                <span className="text-[14px] font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full flex-1 justify-center items-end">
          <Button
            label={t("experienceCard.addToCart")}
            className="rounded-[100px] text-[14px] px-[15px] py-[10px]"
          />
        </div>
      </div>
    </div>
  );
}
