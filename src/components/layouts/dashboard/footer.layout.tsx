import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/typography/typography";
import { useTranslation } from "react-i18next";

export const FooterLayout = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col w-full py-4 px-6 bg-main-dark-green items-center text-white">
      <div className="md:flex-row md:gap-10 md:h-4/5 flex flex-col h-auto w-full">
        <div className="md:w-1/3 flex justify-center">
          <a
            href="https://www.pucrs.br/ima/pro-mata/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logo-pro-mata-invertida.svg"
              alt="Logo Pro Mata"
              className="w-96 h-36"
            />
          </a>
        </div>
        <div className="md:w-2/3 md:items-start flex flex-col w-full items-center mt-5">
          <Typography variant="h5_light">{t("footer.contact")}</Typography>
          <div className="md:flex-row md:items-start flex flex-col w-full mt-5 items-center">
            <div className="w-1/2 gap-4">
              <Typography variant="body_light">
                {t("footer.researchCenter")}
              </Typography>
              <Typography variant="body_light">CIDADE</Typography>
            </div>
            <div className="w-1/2 gap-4">
              <Typography variant="body_light">
                {t("footer.phone")}
              </Typography>
              <Typography variant="body_light">
                {t("footer.email")}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
  <div className="w-full flex justify-center items-center">
        <Typography variant="h6_light">
          {t("footer.copyright", { year })}
        </Typography>
      </div>
    </div>
  );
};
