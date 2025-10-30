import { z } from 'zod';

export const RequestStatusSchema = z.object({
  type: z.enum([
    'CREATED',
    'CANCELED',
    'CANCELED_REQUESTED',
    'EDITED',
    'REJECTED',
    'APPROVED',
    'PEOPLE_REQUESTED',
    'PAYMENT_REQUESTED',
    'PEOPLE_SENT',
    'PAYMENT_SENT',
    'DOCUMENT_REQUESTED',
    'DOCUMENT_APPROVED',
    'DOCUMENT_REJECTED',
  ]),
});

export const RequestUserSchema = z.object({
  id: z.string().uuid('ID de usuário inválido'),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
});

export const RequestMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  document: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  birthDate: z.coerce.date().nullable().optional(), 
});

const RequestListMemberSchema = z.object({
  name: z.string(),
  email: z.string().email().nullable().optional(),
});

export const RequestListItemSchema = z.object({
  id: z.string().uuid(),
  member: RequestListMemberSchema,
  request: RequestStatusSchema,
});

export const RequestListResponseSchema = z.object({
  data: z.array(RequestListItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

const ExperienceImageSchema = z.object({
  url: z.string().url().nullable().optional(),
});

const ExperienceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  price: z.coerce.number().nullable().optional(),
  image: ExperienceImageSchema.nullable().optional(),
});

const ReservationSchema = z.object({
  notes: z.string().nullable().optional(),
  experience: ExperienceSchema,
});

export const RequestDetailResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  description: z.string().nullable().optional(),

  user: RequestUserSchema.nullable().optional(), 
  members: z.array(RequestMemberSchema).optional(),
  reservations: z.array(ReservationSchema),
  requests: z.array(RequestStatusSchema).optional(),
});

export type TRequestListResponse = z.infer<typeof RequestListResponseSchema>;
export type TRequestListItem = z.infer<typeof RequestListItemSchema>;

export type TRequestDetailResponse = z.infer<typeof RequestDetailResponseSchema>;
export type TRequestUser = z.infer<typeof RequestUserSchema>;
export type TRequestMember = z.infer<typeof RequestMemberSchema>;