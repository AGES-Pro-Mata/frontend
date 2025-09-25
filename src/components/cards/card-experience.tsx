import { Button } from "@/components/buttons/defaultButton";
import type { Experience } from "@/types/experiences";
import Person from "/card-experience-icons/person-icon.svg";
import Dolar from "/card-experience-icons/dolar-icon.svg";
import Calendar from "/card-experience-icons/calendar-icon.svg";
import Clock from "/card-experience-icons/clock-icon.svg";
import Map from "/card-experience-icons/map-icon.svg";

interface CardExperienceProps {
  experience: Experience;
}

export function CardExperience({ experience }: CardExperienceProps) {
  console.log(experience.capacity);
  const labelConfig = {
    laboratorio: [
      { icon: Person, text: `${experience.capacity} pessoas` },
      { icon: Dolar, text: `R$ ${experience.price}` },
    ],
    trilha: [
      { icon: Map, text: `${experience.trailLength} km` },
      { icon: Clock, text: `${experience.trailDurationMinutes} min` },
    ],
    evento: [
      {
        icon: Calendar,
        text: new Date(experience.startDate).toLocaleDateString(),
      },
      { icon: Dolar, text: `R$ ${experience.price}` },
    ],
    hospedagem: [
      { icon: Person, text: `${experience.capacity} pessoas` },
      { icon: Dolar, text: `R$ ${experience.price}` },
    ],
  };

  const labels = labelConfig[experience.category] ?? [];

  return (
    <div className="bg-[var(--color-card)] w-[450px] h-[400px] flex justify-center relative rounded-[20px] overflow-hidden">
      <img
        src={`./mock/mock-${experience.category}.png`}
        className="flex h-[50%] w-[90%] object-cover mx-[15px] mt-[20px] box-border rounded-[15px]"
      />
      <div className="flex flex-col absolute justify-between bg-[var(--color-card)] h-[50%] w-full top-[200px] px-[15px] py-[15px] gap-[5px] shadow-[0_0px_12px_rgba(0,0,0,0.8)] z-[50]">
        <div className="flex flex-row gap-[10px] w-full flex-1">
          <div className="flex flex-col flex-1">
            <div className="flex flex-row items-center justify-start gap-[20px]">
              <h3 className="font-bold leading-none flex p-0 m-0 text-[16px] text-[var(--color-main-dark-green)]">
                Nome da Experiência
                <span className="capitalize flex w-fit leading-none items-center text-[10px] ml-[10px] text-[var(--color-on-banner-text)] bg-[var(--color-banner)] py-[4px] px-[12px] rounded-[30px] shadow-[inset_0_0px_2px_1px_rgba(0,0,0,0.3)]">
                  {experience.category.charAt(0).toUpperCase() +
                    experience.category.slice(1).toLowerCase()}
                </span>
              </h3>
            </div>
            <p className="mt-[4px] text-[14px] p-0 m-0 h-[100px] overflow-y-auto text-[var(--color-dark-gray)] scrollbar-hide font-semibold">
              Lorem ipsum dolor sit amet consectetur adipiscing elit feugiat,
              sociosqu conubia augue aenean orci faucibus felis venenatis cras,
              senectus enim fringilla dictumst pretium quisque dignissim. Massa
              et justo rhoncus varius lectus tristique torquent nibh euismod,
              commodo ullamcorper nascetur inceptos sodales velit hendrerit
              porttitor volutpat, nisl tellus ad lacus sed tempus venenatis
              consectetur. Rhoncus cubilia fames nascetur augue, lacinia proin
              fringilla, sociosqu senectus dolor. Mollis pretium class pulvinar
              hac nullam sollicitudin aenean enim integer himenaeos magnis,
              suspendisse netus taciti eu ad dis mauris ultricies nisi vehicula,
              potenti sit velit varius in interdum suscipit sagittis litora
              penatibus. Egestas congue potenti lectus nulla placerat laoreet
              turpis morbi accumsan, vulputate cubilia hendrerit magnis
              efficitur rhoncus nisl sociosqu dui tristique, ultricies conubia
              suspendisse faucibus varius senectus vel mauris. Cursus quam
              torquent rutrum erat augue amet diam, faucibus porta litora
              pretium tristique mattis efficitur imperdiet, senectus velit
              varius gravida ultricies duis.
            </p>
          </div>
          <div className="flex w-[30%] flex-col gap-[15px]">
            {labels.map((label, idx) => (
              <div
                key={idx}
                className="flex flex-row bg-[var(--color-card-labels)] shadow-[inset_0_0px_3px_1px_rgba(0,0,0,0.6)] rounded-[30px] items-center gap-2"
              >
                <img src={label.icon} alt="" className="w-auto h-[28px]" />
                <span className="text-[14px] font-semibold">{label.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full flex-1 justify-center items-end">
          <Button
            label="Adicionar ao carrinho"
            className="rounded-[100px] text-[14px] px-[15px] py-[10px]"
          />
        </div>
      </div>
    </div>
  );
}
