import { createFileRoute } from '@tanstack/react-router'
import { Typography } from "@/components/typography/typography";
import { useTranslation } from "react-i18next";

type PrivacySection = {
  heading?: string;
  body?: string;
  list?: string[];
};

type PrivacyContact = {
  body?: string;
  email?: string;
};

export const Route = createFileRoute('/(index)/privacy')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { t } = useTranslation();
  const rawSections = t("privacyPage.sections", { returnObjects: true });
  const sections: PrivacySection[] = Array.isArray(rawSections)
    ? rawSections.reduce<PrivacySection[]>((accumulator, section) => {
        if (!section || typeof section !== "object") {
          return accumulator;
        }

        const candidate = section as Record<string, unknown>;
        const headingValue = candidate["heading"];
        const bodyValue = candidate["body"];
        const listValue = candidate["list"];

        const safeSection: PrivacySection = {
          heading: typeof headingValue === "string" ? headingValue : undefined,
          body: typeof bodyValue === "string" ? bodyValue : undefined,
          list: Array.isArray(listValue)
            ? listValue.filter((item): item is string => typeof item === "string")
            : undefined,
        };

        accumulator.push(safeSection);

        return accumulator;
      }, [])
    : [];

  const rawContact = t("privacyPage.contact", { returnObjects: true });
  const contact: PrivacyContact =
    rawContact && typeof rawContact === "object"
      ? (({ body, email }) => ({
          body: typeof body === "string" ? body : undefined,
          email: typeof email === "string" ? email : undefined,
        }))(rawContact as Record<string, unknown>)
      : {};

  return (
    <div className="container mx-auto flex min-h-screen max-w-4xl flex-col justify-end p-8">
      <Typography variant="h2" className="mb-6 text-main-dark-green">
        {t("privacyPage.title")}
      </Typography>

      {sections.map((section, index) => (
        <div key={section.heading ?? index} className="mb-6">
          {section.heading && (
            <Typography variant="body" className="mb-2 font-semibold">
              {section.heading}
            </Typography>
          )}
          {section.body && (
            <Typography variant="body" className="mb-4 text-justify">
              {section.body}
            </Typography>
          )}
          {section.list?.length ? (
            <ul className="mb-4 ml-6 list-disc text-justify">
              {section.list.map((item, itemIndex) => (
                <li key={itemIndex} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}

      {contact?.body && (
        <Typography variant="body" className="mt-6 rounded border border-gray-300 p-3 text-justify">
          {contact.body}{" "}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="text-blue-600 underline">
              {contact.email}
            </a>
          )}
          .
        </Typography>
      )}
    </div>
  );
}
