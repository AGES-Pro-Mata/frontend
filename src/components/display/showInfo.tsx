import { Typography } from "@/components/typography";


type showInfoProps = {
  header: string;
  label: string;
}

export const ShowInfo = ({header,label}: showInfoProps) => {
  return(
    <div className="flex flex-col gap-[2px] m-2 sm:m-3">
      <Typography className="text-md font-medium text-foreground text-shadow-xl leading-snug">{header}</Typography>
      <Typography className="text-sm font-semibold ml-2 text-foreground text-shadow-xl leading-snug"><li>{label}</li></Typography>
    </div>
  )
}
