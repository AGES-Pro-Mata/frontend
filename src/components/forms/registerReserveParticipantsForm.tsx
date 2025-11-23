import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarIcon } from "lucide-react";

import { TextInput } from "@/components/input/textInput";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Typography } from "@/components/typography/typography";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import {
  cn,
  dateToIso,
  digitsOnly,
  isValidCpf,
  isoToDate,
  maskCpf,
  maskDateBR,
  maskPhone,
  toBRForDisplay,
  toIsoFromBR,
} from "@/lib/utils";

import type { ReserveParticipantDraft, ReserveParticipantGender } from "@/types/reserve";

export type ReserveParticipantInputsProps = {
  person: ReserveParticipantDraft;
  readOnly?: boolean;
  disabled?: boolean;
  onFieldChange?: <K extends keyof ReserveParticipantDraft>(
    field: K,
    value: ReserveParticipantDraft[K],
  ) => void;
  className?: string;
};

function ReserveParticipantInputs({
  person,
  readOnly = false,
  disabled = false,
  onFieldChange,
  className,
}: ReserveParticipantInputsProps) {
  const { t } = useTranslation();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t("validation.nameRequired")),
        phone: z.string().trim().min(1, t("validation.phoneRequired")),
        birthDate: z.string().trim().min(1, t("validation.birthDateRequired")),
        document: z
          .string()
          .trim()
          .min(1, t("validation.cpfRequired"))
          .refine((value) => isValidCpf(digitsOnly(value)), t("validation.cpfInvalid")),
        gender: z.string().trim().min(1, t("validation.genderRequired")),
      }),
    [t],
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: person.name ?? "",
      phone: person.phone ?? "",
      birthDate: toBRForDisplay(person.birthDate),
      document: person.document ?? "",
      gender: person.gender ?? "",
    },
  });

  const genderOptions = useMemo(
    () => ({
      MALE: t("reserveFlow.peopleStep.genderOptions.male"),
      FEMALE: t("reserveFlow.peopleStep.genderOptions.female"),
      OTHER: t("reserveFlow.peopleStep.genderOptions.other"),
    }),
    [t],
  ) as Record<ReserveParticipantGender, string>;

  const handleChange = <K extends keyof ReserveParticipantDraft>(
    field: K,
    value: ReserveParticipantDraft[K],
  ) => {
    if (onFieldChange) onFieldChange(field, value);
  };

  const isReadOnly = readOnly === true;
  const isSelectDisabled = disabled || isReadOnly;
  const dateForCalendar = isoToDate(person.birthDate || "");
  const calendarStartMonth = useMemo(() => new Date(1900, 0), []);
  const calendarEndMonth = useMemo(() => {
    const now = new Date();

    return new Date(now.getFullYear(), 11);
  }, []);

  useEffect(() => {
    form.setValue("name", person.name ?? "", {
      shouldValidate: false,
      shouldDirty: false,
    });
    form.setValue("phone", person.phone ?? "", {
      shouldValidate: false,
      shouldDirty: false,
    });
    form.setValue("birthDate", toBRForDisplay(person.birthDate || ""), {
      shouldValidate: false,
      shouldDirty: false,
    });
    form.setValue("document", person.document ?? "", {
      shouldValidate: false,
      shouldDirty: false,
    });
    form.setValue("gender", person.gender ?? "", {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [form, person.birthDate, person.document, person.gender, person.name, person.phone]);

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(() => undefined)(event);
        }}
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <TextInput
                label={t("reserveFlow.peopleStep.fields.name.label")}
                required
                placeholder={t("reserveFlow.peopleStep.fields.name.placeholder")}
                value={field.value}
                onChange={(event) => {
                  field.onChange(event.target.value);
                  handleChange("name", event.target.value);
                }}
                onBlur={() => {
                  field.onBlur();
                  void form.trigger("name");
                }}
                disabled={disabled}
                readOnly={isReadOnly}
                tabIndex={isReadOnly ? -1 : undefined}
                className={cn(
                  "xl:min-w-[12rem]",
                  isReadOnly ? "pointer-events-none text-main-dark-green" : undefined,
                )}
              />
              <FormMessage className="text-default-red" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <TextInput
                label={t("reserveFlow.peopleStep.fields.phone.label")}
                required
                placeholder={t("reserveFlow.peopleStep.fields.phone.placeholder")}
                value={maskPhone(field.value || "")}
                onChange={(event) => {
                  const digits = digitsOnly(event.target.value).slice(0, 11);
                  const masked = maskPhone(digits);

                  field.onChange(masked);
                  handleChange("phone", masked);
                }}
                onBlur={() => {
                  field.onBlur();
                  void form.trigger("phone");
                }}
                disabled={disabled}
                readOnly={isReadOnly}
                tabIndex={isReadOnly ? -1 : undefined}
                className={cn(
                  "xl:min-w-[12rem]",
                  isReadOnly ? "pointer-events-none text-main-dark-green" : undefined,
                )}
              />
              <FormMessage className="text-default-red" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-0.7 xl:min-w-[12rem]">
              <Typography className="mb-1 flex flex-wrap items-center gap-1 text-foreground font-medium leading-tight">
                <span>{t("reserveFlow.peopleStep.fields.birthDate.label")}</span>
                <span>*</span>
              </Typography>
              <div className="relative">
                <TextInput
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="DD/MM/AAAA"
                  value={field.value}
                  onChange={(event) => {
                    const masked = maskDateBR(event.target.value);

                    field.onChange(masked);
                    handleChange("birthDate", masked);
                  }}
                  onBlur={(event) => {
                    field.onBlur();
                    const iso = toIsoFromBR(event.target.value);

                    if (iso) {
                      handleChange("birthDate", iso);
                    }
                    void form.trigger("birthDate");
                  }}
                  disabled={disabled}
                  readOnly={isReadOnly}
                  tabIndex={isReadOnly ? -1 : undefined}
                  className={cn(
                    "w-full xl:min-w-[13.3rem] pr-10",
                    isReadOnly ? "pointer-events-none text-main-dark-green" : undefined,
                  )}
                />

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8",
                        "inline-flex items-center justify-center rounded-md",
                        "bg-transparent",
                        "text-foreground/80",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                      disabled={disabled || isReadOnly}
                      aria-label={t("reserveFlow.peopleStep.fields.birthDate.label")}
                    >
                      <CalendarIcon className="h-4 w-4 pointer-events-none" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
                    <Calendar
                      mode="single"
                      selected={dateForCalendar}
                      onSelect={(date) => {
                        if (date) {
                          const iso = dateToIso(date);

                          handleChange("birthDate", iso);
                          form.setValue("birthDate", toBRForDisplay(iso), {
                            shouldValidate: true,
                          });
                        }
                        setCalendarOpen(false);
                      }}
                      startMonth={calendarStartMonth}
                      endMonth={calendarEndMonth}
                      captionLayout="dropdown"
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage className="text-default-red mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <TextInput
                label={t("reserveFlow.peopleStep.fields.cpf.label")}
                required
                placeholder={t("reserveFlow.peopleStep.fields.cpf.placeholder")}
                value={field.value}
                onChange={(event) => {
                  const digits = digitsOnly(event.target.value).slice(0, 11);
                  const masked = maskCpf(digits);

                  field.onChange(masked);
                  handleChange("document", masked);
                }}
                onBlur={() => {
                  field.onBlur();
                  void form.trigger("document");
                }}
                disabled={disabled}
                readOnly={isReadOnly}
                tabIndex={isReadOnly ? -1 : undefined}
                className={cn(
                  "xl:min-w-[12rem]",
                  isReadOnly ? "pointer-events-none text-main-dark-green" : undefined,
                )}
              />
              <FormMessage className="text-default-red" />
            </FormItem>
          )}
        />

        {isReadOnly ? (
          <TextInput
            label={t("reserveFlow.peopleStep.fields.gender.label")}
            required
            value={
              person.gender && person.gender in genderOptions ? genderOptions[person.gender] : ""
            }
            readOnly
            tabIndex={-1}
            className={cn("xl:min-w-[12rem] pointer-events-none text-main-dark-green")}
          />
        ) : (
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 xl:min-w-[12rem]">
                <Label className="flex items-center gap-1 text-sm font-medium text-foreground">
                  <span>{t("reserveFlow.peopleStep.fields.gender.label")}</span>
                  <span>*</span>
                </Label>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChange("gender", value as ReserveParticipantGender | "");
                  }}
                  disabled={isSelectDisabled}
                >
                  <FormControl>
                    <SelectTrigger
                      size="default"
                      className={cn(
                        "h-12 border border-dark-gray/40 bg-soft-white text-sm hover:cursor-pointer",
                        isSelectDisabled ? "opacity-80" : "",
                        form.formState.errors.gender
                          ? "border-default-red focus:ring-0 focus-visible:ring-0"
                          : "",
                      )}
                      aria-invalid={form.formState.errors.gender ? true : undefined}
                    >
                      <SelectValue
                        placeholder={t("reserveFlow.peopleStep.fields.gender.placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {Object.entries(genderOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value as ReserveParticipantGender}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-default-red" />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}

export { ReserveParticipantInputs };
export default ReserveParticipantInputs;
