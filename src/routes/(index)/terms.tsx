import { createFileRoute } from '@tanstack/react-router'
import { Typography } from "@/components/typography/typography";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute('/(index)/terms')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const translatedParagraphs = t("termsPage.paragraphs", { returnObjects: true });
  const paragraphs = Array.isArray(translatedParagraphs) ? translatedParagraphs : [];

  return (
    <div className="container mx-auto flex max-w-4xl flex-col p-8">
      <Typography variant="h2" className="mb-6 text-main-dark-green">
        {t("termsPage.title")}
      </Typography>

      {paragraphs.map((paragraph, index) => (
        <Typography key={index} variant="body" className="mb-4 text-justify">
          {paragraph}
        </Typography>
      ))}
    </div>
  );
}
