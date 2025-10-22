import { Typography } from "@/components/typography/typography";
import type { Locale } from "@/types/locale";
import { CalendarDays, CircleDollarSign, User } from "lucide-react";
import type { ComponentType } from "react";

type SummaryXpProps = {
  experience: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  locale: Locale;
  imageUrl: string;
};

type InfoItemProps = {
  icon: ComponentType<{ className?: string }>;
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
}: SummaryXpProps) => {
  const formatDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-");

    if (!year || !month || !day) {
      return isoDate;
    }

    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(Number(year), Number(month) - 1, Number(day)));
  };

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const formattedPrice = currencyFormatter.format(price);

  return (
    <div className="flex gap-4 p-4 pr-16 bg-card-background w-fit rounded-2xl items-center shadow-xl">
      <div>
        <img src={imageUrl} alt={experience} className="rounded-2xl" />
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="h4" className="text-main-dark-green mb-2">
          {experience}
        </Typography>
        <InfoItem
          icon={CalendarDays}
          text={`${formattedStartDate} a ${formattedEndDate}`}
        />
        <InfoItem icon={CircleDollarSign} text={formattedPrice} />
        <InfoItem icon={User} text={`${capacity} pessoas`} />
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, text }: InfoItemProps) => {
  return (
    <div className="flex items-center gap-2 bg-soft-white rounded-2xl shadow-[inset_0_0_0_2px_rgba(0,0,0,0.15)]">
      <Icon className="h-6 w-6 text-main-dark-green" />
      <Typography variant="h6" className="text-main-dark-green pr-6">
        {text}
      </Typography>
    </div>
  );
};
