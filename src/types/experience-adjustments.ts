export type ExperienceAdjustmentPeriodInput = {
  start?: string | Date;
  end?: string | Date;
};

export type RawExperienceAdjustment = {
  title?: string;
  name?: string;
  price?: number;
  type?: string;
  period?: ExperienceAdjustmentPeriodInput;
  periodStart?: string | Date;
  periodEnd?: string | Date;
  imageUrl?: string;
  experienceId?: string | number;
  id?: string | number;
};

export type NormalizedExperienceAdjustment = {
  title: string;
  price: number;
  type: string;
  period: {
    start: Date;
    end: Date;
  };
  imageUrl: string;
  experienceId?: string;
};
