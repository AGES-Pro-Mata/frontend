import { Typography } from "./ui/typography"

type showInfoProps = {
  header: string;
  label: string;
}

export const ShowInfo = ({header,label}: showInfoProps) => {
  return(
    <div className="flex flex-col gap-1 m-4">
      <Typography className="text-lg font-medium text-black text-shadow-xl">{header}</Typography>
      <Typography className="text-base font-semibold ml-2 text-black text-shadow-xl"><li>{label}</li></Typography>
    </div>
  )
}
