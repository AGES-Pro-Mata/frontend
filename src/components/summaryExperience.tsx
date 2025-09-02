import calendarIcon from "../../public/calendar-icon.svg";
import priceIcon from "../../public/price-icon.svg";
import personIcon from "../../public/person-icon.svg";
import xpImage from "../../public/xp-image.png";
import { Typography } from "./ui/typography";

type summaryXpProps = {
  experience: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
};

type infoItemProps = {
  img: string;
  txt: string;
};

export const SummaryExperience = ({
  experience,
  startDate,
  endDate,
  price,
  capacity,
}: summaryXpProps) => {
  return (
    <div className="flex gap-4 p-4 pr-16 bg-[#E7DED4] w-fit rounded-2xl items-center shadow-xl">
      <div>
        <img src={xpImage} alt="" className="rounded-2xl" />
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="h4" className="text-[#2E361D] mb-2">
          {experience}
        </Typography>
        <InfoItem
          img={calendarIcon}
          txt={`${startDate} a ${endDate}`}
        ></InfoItem>
        <InfoItem img={priceIcon} txt={`R$ ${price}`}></InfoItem>
        <InfoItem img={personIcon} txt={`${capacity} pessoas`}></InfoItem>
      </div>
    </div>
  );
};

const InfoItem = ({ img, txt }: infoItemProps) => {
  return (
    <div className="flex items-center gap-2 bg-[#F6EDE4] rounded-2xl shadow-[inset_0_0_0_2px_rgba(0,0,0,0.15)]">
      <img src={img} alt="" className="w-7" />
      <Typography variant="h6" className="text-[#2E361D] pr-6">
        {txt}
      </Typography>
    </div>
  );
};
