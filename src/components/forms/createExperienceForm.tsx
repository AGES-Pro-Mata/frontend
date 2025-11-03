import { Button } from "@/components/button/defaultButton";
import { TextInput } from "@/components/input/textInput";
import { appToast } from "@/components/toast/toast";
import { Typography } from "@/components/typography/typography";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import type { CreateExperiencePayload } from "@/api/experience";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCreateExperience } from "@/hooks/useCreateExperience";
import { useLoadImage } from "@/hooks/useLoadImage";
import { ExperienceCategory } from "@/types/experience";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bed,
  Building2,
  Calendar,
  CalendarIcon,
  FlaskConical,
  Mountain,
  Upload,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    experienceName: z.string().min(2, "Informe o nome da experiência"),
    experienceDescription: z
      .string()
      .min(2, "Informe a descrição da experiência"),
    experienceCategory: z.nativeEnum(ExperienceCategory),
    experienceCapacity: z.coerce
      .number()
      .min(1, "Informe a quantidade de pessoas"),
    experienceImage: z.instanceof(File, {
      message: "Selecione uma imagem para a experiência",
    }),
    experienceStartDate: z.date().optional(),
    experienceEndDate: z.date().optional(),
    experiencePrice: z.coerce.number().optional(),
    experienceWeekDays: z.array(z.string()).optional().default([]),
    trailDurationMinutes: z.coerce.number().optional(),
    trailDifficulty: z.string().optional(),
    trailLength: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.experienceEndDate &&
      data.experienceStartDate &&
      data.experienceEndDate < data.experienceStartDate
    ) {
      ctx.addIssue({
        code: "custom",
        message: "A data de fim deve ser posterior à data de início",
        path: ["experienceEndDate"],
      });
    }
    if (data.experienceCategory === ExperienceCategory.TRILHA) {
      const hasValidMinutes =
        !!data.trailDurationMinutes && data.trailDurationMinutes > 0;

      if (!hasValidMinutes) {
        ctx.addIssue({
          code: "custom",
          message: "Informe a duração em minutos",
          path: ["trailDurationMinutes"],
        });
      }

      if (!data.trailDifficulty || data.trailDifficulty.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Informe a dificuldade da trilha",
          path: ["trailDifficulty"],
        });
      }

      if (!data.trailLength || data.trailLength.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Informe o comprimento da trilha",
          path: ["trailLength"],
        });
      }
    }
  });

const WEEK_DAYS = [
  { value: "MONDAY", label: "Segunda-feira" },
  { value: "TUESDAY", label: "Terça-feira" },
  { value: "WEDNESDAY", label: "Quarta-feira" },
  { value: "THURSDAY", label: "Quinta-feira" },
  { value: "FRIDAY", label: "Sexta-feira" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const DIFFICULTY_LEVELS = [
  { value: "LIGHT", label: "Leve" },
  { value: "MEDIUM", label: "Moderado" },
  { value: "HARD", label: "Pesado" },
  { value: "EXTREME", label: "Extremo" },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case ExperienceCategory.LABORATORIO:
      return <FlaskConical className="h-4 w-4" />;
    case ExperienceCategory.TRILHA:
      return <Mountain className="h-4 w-4" />;
    case ExperienceCategory.HOSPEDAGEM:
      return <Bed className="h-4 w-4" />;
    case ExperienceCategory.EVENTO:
      return <Calendar className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

const formatPrice = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const cents = parseInt(numbers) || 0;
  const formatted = (cents / 100).toFixed(2).replace(".", ",");

  return formatted;
};

const parsePrice = (formattedValue: string) => {
  const numbers = formattedValue.replace(/\D/g, "");

  return parseInt(numbers) || 0;
};

export function CreateExperience() {
  const { mutate } = useCreateExperience();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: previewLoaded, isLoading: previewLoading } = useLoadImage(imagePreview || "");
  const [priceDisplay, setPriceDisplay] = useState<string>("");

  const form = useForm<
    z.input<typeof formSchema>,
    any,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experienceName: "",
      experienceDescription: "",
      experienceCategory: ExperienceCategory.LABORATORIO,
      experienceCapacity: 1,
      experienceStartDate: undefined,
      experienceEndDate: undefined,
      experiencePrice: 0,
      experienceWeekDays: [],
      trailDurationMinutes: undefined,
      trailDifficulty: undefined,
      trailLength: undefined,
    },
  });

  const watchedCategory = form.watch("experienceCategory");
  const watchedStartDate = form.watch("experienceStartDate");
  const watchedEndDate = form.watch("experienceEndDate");

  useEffect(() => {
    if (
      watchedStartDate &&
      watchedEndDate &&
      watchedEndDate < watchedStartDate
    ) {
      form.setValue("experienceEndDate", undefined as any);
    }
  }, [watchedStartDate, watchedEndDate, form]);

  const getDisabledDates = (isStartDate: boolean) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (isStartDate) {
      return { before: today };
    } else {
      const startDate = watchedStartDate;

      if (startDate) {
        return {
          before: startDate > today ? startDate : today,
        };
      }

      return { before: today };
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem");

        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("Arquivo muito grande. Tamanho máximo: 10MB");

        return;
      }

      form.setValue("experienceImage", file);

      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    const payload: CreateExperiencePayload = {
      ...data,
      experienceWeekDays: (data.experienceWeekDays ?? []).map((day) =>
        day.toUpperCase()
      ),
    };

    mutate(payload, {
      onSuccess: () => {
        appToast.success("Experiência criada com sucesso");
      },
      onError: () => {
        appToast.error("Erro ao criar experiência");
      },
    });
  });

  return (
    <div className="pb-8 pt-6 justify-items-center">
      <div className="space-y-2 mb-6">
        <Typography className="text-2xl font-semibold text-on-banner-text">
          Criar Experiência
        </Typography>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="experienceImage"
            render={() => (
              <FormItem>
                <Typography className="font-medium text-foreground text-lg">
                  Imagem da Experiência *
                </Typography>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    {imagePreview ? (
                      <div className="relative max-w-full max-h-48">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className={`max-w-full max-h-48 object-cover rounded-lg transition-opacity duration-300 ${
                            previewLoaded && !previewLoading ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {previewLoading && (
                          <div className="absolute inset-0 animate-pulse bg-muted rounded-lg" />
                        )}
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-contrast-green" />
                        <Typography className="text-lg font-medium text-foreground">
                          SELECIONE UMA IMAGEM
                        </Typography>
                      </>
                    )}
                  </label>
                  <Typography className="text-sm text-muted-foreground mt-2">
                    Sua imagem deve ser dimensionada em 400x200, nos formatos
                    .PNG, .JPG e .JPEG, com limite de tamanho de 10MB
                  </Typography>
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="experienceName"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Nome da experiência"
                    required
                    placeholder="Digite o nome da experiência"
                    {...field}
                  />
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceCategory"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-0">
                    <Typography className="text-foreground font-medium mb-1">
                      Tipo de experiência *
                    </Typography>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(field.value)}
                              <Typography>
                                {field.value ===
                                  ExperienceCategory.LABORATORIO &&
                                  "Laboratório"}
                                {field.value === ExperienceCategory.TRILHA &&
                                  "Trilha"}
                                {field.value ===
                                  ExperienceCategory.HOSPEDAGEM && "Hospedagem"}
                                {field.value === ExperienceCategory.EVENTO &&
                                  "Evento"}
                              </Typography>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ExperienceCategory.LABORATORIO}>
                          <div className="flex items-center gap-2">
                            <FlaskConical className="h-4 w-4" />
                            Laboratório
                          </div>
                        </SelectItem>
                        <SelectItem value={ExperienceCategory.TRILHA}>
                          <div className="flex items-center gap-2">
                            <Mountain className="h-4 w-4" />
                            Trilha
                          </div>
                        </SelectItem>
                        <SelectItem value={ExperienceCategory.HOSPEDAGEM}>
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4" />
                            Hospedagem
                          </div>
                        </SelectItem>
                        <SelectItem value={ExperienceCategory.EVENTO}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Evento
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceCapacity"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Quantidade de pessoas"
                    required
                    type="number"
                    placeholder="Digite a quantidade de pessoas que o laboratório suporta"
                    value={field.value as number | undefined}
                    onChange={(e) =>
                      field.onChange(
                        e.currentTarget.value === ""
                          ? undefined
                          : Number(e.currentTarget.value)
                      )
                    }
                  />
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceWeekDays"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-0">
                    <Typography className="text-foreground font-medium mb-1">
                      Dias da semana disponíveis
                    </Typography>
                    <Popover>
                      <PopoverTrigger asChild>
                        <ShadcnButton
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-10 px-3"
                        >
                          {field.value && field.value.length > 0 ? (
                            <Typography className="text-sm">
                              {field.value.length} dia(s) selecionado(s)
                            </Typography>
                          ) : (
                            <Typography className="text-sm text-muted-foreground">
                              Selecione os dias da semana
                            </Typography>
                          )}
                        </ShadcnButton>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <div className="p-4 space-y-2">
                          {WEEK_DAYS.map((day) => (
                            <div
                              key={day.value}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={day.value}
                                checked={
                                  field.value?.includes(day.value) || false
                                }
                                onCheckedChange={(checked) => {
                                  const currentDays = field.value || [];

                                  if (checked) {
                                    field.onChange([...currentDays, day.value]);
                                  } else {
                                    field.onChange(
                                      currentDays.filter((d) => d !== day.value)
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={day.value}
                                className="text-sm cursor-pointer font-normal"
                              >
                                {day.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="experienceDescription"
            render={({ field }) => (
              <FormItem>
                <Typography className="text-foreground font-medium mb-2">
                  Descrição da experiência
                </Typography>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descreva a experiência..."
                  {...field}
                />
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="experienceStartDate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-0">
                    <Typography className="text-foreground font-medium mb-1">
                      Data de início
                    </Typography>
                    <Popover>
                      <PopoverTrigger asChild>
                        <ShadcnButton
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          ) : (
                            <Typography>Selecione a data</Typography>
                          )}
                        </ShadcnButton>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={getDisabledDates(true)}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceEndDate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-0">
                    <Typography className="text-foreground font-medium mb-1">
                      Data de fim
                    </Typography>
                    <Popover>
                      <PopoverTrigger asChild>
                        <ShadcnButton
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          ) : (
                            <Typography>Selecione a data</Typography>
                          )}
                        </ShadcnButton>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={getDisabledDates(false)}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experiencePrice"
              render={({ field }) => (
                <FormItem>
                  <TextInput
                    label="Preço R$ (Diária)"
                    placeholder="0,00"
                    value={priceDisplay}
                    onChange={(e) => {
                      const formatted = formatPrice(e.target.value);

                      setPriceDisplay(formatted);
                      field.onChange(parsePrice(formatted));
                    }}
                  />
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {watchedCategory === ExperienceCategory.TRILHA && (
            <div className="space-y-4">
              <Separator />
              <Typography className="font-medium text-foreground text-lg">
                Informações da Trilha
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="trailDurationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <TextInput
                        label="Duração (minutos)"
                        required
                        type="number"
                        placeholder="Ex: 120"
                        value={field.value as number | undefined}
                        onChange={(e) =>
                          field.onChange(
                            e.currentTarget.value === ""
                              ? undefined
                              : Number(e.currentTarget.value)
                          )
                        }
                      />
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trailDifficulty"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-0">
                        <Typography className="text-foreground font-medium mb-1">
                          Dificuldade *
                        </Typography>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a dificuldade" />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFFICULTY_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trailLength"
                  render={({ field }) => (
                    <FormItem>
                      <TextInput
                        label="Distância (km)"
                        required
                        placeholder="Ex: 5.2"
                        {...field}
                      />
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              label="Voltar"
              className="w-36"
              onClick={() => history.back()}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-36"
              onClick={onSubmit}
              label="Criar"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
