import { z } from 'zod'
import {
  GLASS_SIZE_MAX_MM,
  GLASS_SIZE_MIN_MM,
  ORDER_STATUSES,
  PHONE_EXAMPLE,
  QUANTITY_MIN,
} from '../config'
import type { OrderStatus } from '../types'
import { normalizePhone } from './phone'

export function isOrderStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUSES.some((status) => status === value)
}

export const ordersFiltersSchema = z.object({
  q: z.string(),
  status: z.union([z.enum(ORDER_STATUSES), z.literal('')]),
})

export const orderIdSchema = z.number().int().positive()

function glassSizeField(emptyMessage: string) {
  return z
    .number({ error: emptyMessage })
    .int('Тільки ціле число міліметрів')
    .min(GLASS_SIZE_MIN_MM, `Від ${GLASS_SIZE_MIN_MM} мм`)
    .max(GLASS_SIZE_MAX_MM, `До ${GLASS_SIZE_MAX_MM} мм`)
}

export const newOrderItemSchema = z.object({
  glassTypeId: z.number({ error: 'Оберіть тип скла' }).int(),
  width: glassSizeField('Вкажіть ширину'),
  height: glassSizeField('Вкажіть висоту'),
  quantity: z
    .number({ error: 'Вкажіть кількість' })
    .int('Тільки ціле число')
    .min(QUANTITY_MIN, `Мінімум ${QUANTITY_MIN}`),
})

export const newOrderSchema = z.object({
  clientName: z.string().trim().min(1, 'Вкажіть клієнта'),
  phone: z
    .string()
    .trim()
    .min(1, { error: 'Вкажіть телефон', abort: true })
    .refine((phone) => normalizePhone(phone) !== null, `Номер +380 і 9 цифр, наприклад ${PHONE_EXAMPLE}`)
    .transform((phone) => normalizePhone(phone) ?? phone),
  items: z.array(newOrderItemSchema).min(1, 'Додайте хоча б одну позицію'),
})

export type NewOrder = z.infer<typeof newOrderSchema>
export type NewOrderItem = z.infer<typeof newOrderItemSchema>
