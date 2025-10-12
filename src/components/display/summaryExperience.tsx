const calendarIcon = "/calendar-icon.svg";
const priceIcon = "/price-icon.svg";
const personIcon = "/person-icon.svg";
import { Typography } from "@/components/typography/typography";
import type { Locale } from "@/types/locale";

type summaryXpProps = {
  experience: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  locale: Locale;
  imageUrl: string;
};

type infoItemProps = {
  img: string;
  text: string;
};

export const SummaryExperience = ({
  experience,
  startDate,
  endDate,
  price,
  capacity,
  locale,
  imageUrl,
}: summaryXpProps) => {
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "short" });

  const formattedStartDate = dateFormatter.format(new Date(startDate));
  const formattedEndDate = dateFormatter.format(new Date(endDate));

  return (
    <div className="flex gap-4 p-4 pr-16 bg-card-background w-fit rounded-2xl items-center shadow-xl">
      <div>
        <img src={imageUrl} alt="" className="rounded-2xl" />
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="h4" className="text-main-dark-green mb-2">
          {experience}
        </Typography>
        <InfoItem
          img={calendarIcon}
          text={`${formattedStartDate} a ${formattedEndDate}`}
        ></InfoItem>
        <InfoItem img={priceIcon} text={`R$ ${price}`}></InfoItem>
        <InfoItem img={personIcon} text={`${capacity} pessoas`}></InfoItem>
      </div>
    </div>
  );
};

const InfoItem = ({ img, text }: infoItemProps) => {
  return (
    <div className="flex items-center gap-2 bg-soft-white rounded-2xl shadow-[inset_0_0_0_2px_rgba(0,0,0,0.15)]">
      <img src={img} alt="" className="w-7" />
      <Typography variant="h6" className="text-main-dark-green pr-6">
        {text}
      </Typography>
    </div>
  );
};
