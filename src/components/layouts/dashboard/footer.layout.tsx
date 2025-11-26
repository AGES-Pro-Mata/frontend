import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/typography/typography";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

export const FooterLayout = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const PHONE_NUMBER = "(51) 3320 3640";
  const EMAIL_ADDRESS = "promata@pucrs.br";

  return (
    <div className="flex flex-col w-full py-4 px-6 bg-main-dark-green items-center text-white">
      <div className="md:flex-row md:gap-10 md:h-4/5 flex flex-col h-auto w-full">
        <div className="md:w-1/3 flex justify-center">
          <a href="https://www.pucrs.br/ima/pro-mata/" target="_blank" rel="noopener noreferrer">
            <img src="/logo-pro-mata-invertida.svg" alt="Logo Pro Mata" className="w-96 h-36" />
          </a>
        </div>
        <div className="md:w-2/3 flex flex-col w-full items-start mt-5">
          <Typography variant="h5_light">{t("footer.contact")}</Typography>
          <div className="md:flex-row md:items-start flex flex-col w-full mt-5 items-start">
            <div className="w-full md:w-1/2 gap-4">
              <Typography variant="body_light">{t("footer.researchCenter")}</Typography>
              <Typography variant="body_light">São Francisco de Paula - RS</Typography>
              <div className="mt-3 flex flex-col">
                <Link to="/terms">
                  <Typography
                    variant="body_light"
                    className="underline hover:no-underline cursor-pointer"
                  >
                    {t("termsPage.title")}
                  </Typography>
                </Link>
                <Link to="/privacy">
                  <Typography
                    variant="body_light"
                    className="underline hover:no-underline cursor-pointer"
                  >
                    {t("privacyPage.title")}
                  </Typography>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 gap-4 mt-4 md:mt-0">
              <Typography variant="body_light">
                {t("footer.phoneLabel")}: {PHONE_NUMBER}
              </Typography>
              <Typography variant="body_light">
                {t("footer.emailLabel")}: {""}
                <a href={`mailto:${EMAIL_ADDRESS}`} className="underline hover:no-underline">
                  {EMAIL_ADDRESS}
                </a>
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />
      <div className="mt-4 flex w-full items-center justify-center">
        <Typography variant="h6_light" className="text-center">
          {t("footer.copyright", { year })}
        </Typography>
      </div>
    </div>
  );
};
