import { Button, NumberInput, Select, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  GLASS_SIZE_MAX_MM,
  GLASS_SIZE_MIN_MM,
  PHONE_EXAMPLE,
  QUANTITY_MIN,
} from '../config'
import { formatArea, formatMoney, formatPrice } from '../lib/format'
import { formatPhone, normalizePhone } from '../lib/phone'
import { getItemPrice, sumPrices } from '../lib/pricing'
import type { ItemPrice } from '../lib/pricing'
import { orderQueryOptions } from '../lib/queries'
import { newOrderItemSchema, newOrderSchema } from '../lib/schemas'
import type { NewOrder } from '../lib/schemas'
import { createOrder } from '../server/orders.functions'
import type { GlassType } from '../types'

type ItemFormValues = {
  key: string
  glassTypeId: number | null
  width: number | string
  height: number | string
  quantity: number | string
}

type OrderFormValues = {
  clientName: string
  phone: string
  items: ItemFormValues[]
}

function createEmptyItem(): ItemFormValues {
  return { key: randomId(), glassTypeId: null, width: '', height: '', quantity: QUANTITY_MIN }
}

function getDraftPrice(item: ItemFormValues, glassTypes: GlassType[]): ItemPrice | null {
  const parsed = newOrderItemSchema.safeParse(item)
  if (!parsed.success) return null

  const glassType = glassTypes.find((type) => type.id === parsed.data.glassTypeId)
  if (!glassType) return null

  return getItemPrice({
    width: parsed.data.width,
    height: parsed.data.height,
    quantity: parsed.data.quantity,
    pricePerM2: glassType.pricePerM2,
  })
}

function TotalValue({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-[var(--peach-ink)]">{label}</p>
      <p key={value} className={strong ? 'bump text-2xl font-black text-[var(--peach-ink)]' : 'bump text-xl font-black text-[var(--peach-ink)]'}>
        {value}
      </p>
    </div>
  )
}

export function NewOrderForm({ glassTypes }: { glassTypes: GlassType[] }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<OrderFormValues>({
    mode: 'controlled',
    initialValues: {
      clientName: '',
      phone: '',
      items: [createEmptyItem()],
    },
    validate: schemaResolver(newOrderSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const saveOrder = useMutation({
    mutationFn: (newOrder: NewOrder) => createOrder({ data: newOrder }),
    onSuccess: async (order) => {
      queryClient.setQueryData(orderQueryOptions(order.id).queryKey, order)
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
      await navigate({ to: '/orders/$orderId', params: { orderId: String(order.id) } })
    },
  })

  const glassOptions = glassTypes.map((type) => ({
    value: String(type.id),
    label: `${type.name} — ${formatPrice(type.pricePerM2)}/м²`,
  }))

  const normalizedPhone = normalizePhone(form.values.phone)
  const draftPrices = form.values.items.map((item) => getDraftPrice(item, glassTypes))
  const readyPrices = draftPrices.filter((price) => price !== null)
  const total = sumPrices(readyPrices)

  function addItem() {
    form.insertListItem('items', createEmptyItem())
    form.clearFieldError('items')
  }

  function submitOrder(values: OrderFormValues) {
    saveOrder.mutate(newOrderSchema.parse(values))
  }

  return (
    <form className="new-order-form flex flex-col gap-6" onSubmit={form.onSubmit(submitOrder)} noValidate>
      <section className="new-order-client sticker rise-in grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <TextInput
          label="Клієнт"
          placeholder="Ім'я або назва компанії"
          withAsterisk
          {...form.getInputProps('clientName')}
        />
        <TextInput
          label="Телефон"
          placeholder={PHONE_EXAMPLE}
          type="tel"
          withAsterisk
          description={normalizedPhone ? `✓ Буде збережено як ${formatPhone(normalizedPhone)}` : undefined}
          inputWrapperOrder={['label', 'input', 'description', 'error']}
          {...form.getInputProps('phone')}
        />
      </section>

      <section className="new-order-items-section">
        <h2 className="hand mb-3 text-4xl">Позиції</h2>
        <div className="new-order-items flex flex-col gap-4">
          {form.values.items.map((item, index) => {
            const price = draftPrices[index]
            return (
              <article key={item.key} className="new-order-item sticker pop-in p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="hand text-2xl leading-none text-[var(--ink-soft)]">Позиція {index + 1}</span>
                  <button
                    type="button"
                    className="new-order-remove group inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-extrabold text-[var(--rose-ink)] transition-colors hover:bg-[var(--rose)]"
                    onClick={() => form.removeListItem('items', index)}
                  >
                    <span className="inline-block transition-transform duration-300 ease-[var(--spring)] group-hover:rotate-90">×</span>
                    Видалити
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                  <Select
                    label="Тип скла"
                    placeholder="Оберіть"
                    data={glassOptions}
                    withAsterisk
                    value={item.glassTypeId === null ? null : String(item.glassTypeId)}
                    onChange={(value) =>
                      form.setFieldValue(`items.${index}.glassTypeId`, value ? Number(value) : null)
                    }
                    error={form.errors[`items.${index}.glassTypeId`]}
                  />
                  <NumberInput
                    label="Ширина, мм"
                    min={GLASS_SIZE_MIN_MM}
                    max={GLASS_SIZE_MAX_MM}
                    allowDecimal={false}
                    allowNegative={false}
                    clampBehavior="none"
                    withAsterisk
                    {...form.getInputProps(`items.${index}.width`)}
                  />
                  <NumberInput
                    label="Висота, мм"
                    min={GLASS_SIZE_MIN_MM}
                    max={GLASS_SIZE_MAX_MM}
                    allowDecimal={false}
                    allowNegative={false}
                    clampBehavior="none"
                    withAsterisk
                    {...form.getInputProps(`items.${index}.height`)}
                  />
                  <NumberInput
                    label="Кількість"
                    min={QUANTITY_MIN}
                    allowDecimal={false}
                    allowNegative={false}
                    clampBehavior="none"
                    withAsterisk
                    {...form.getInputProps(`items.${index}.quantity`)}
                  />
                </div>
                <p className="new-order-item-price mt-3 text-sm font-bold">
                  {price ? (
                    <span key={price.costKopecks} className="bump">
                      {formatArea(price.billableAreaMm2)} до оплати · <span className="font-black">{formatMoney(price.costKopecks)}</span>
                    </span>
                  ) : (
                    <span className="text-[var(--ink-soft)]">Заповніть позицію, щоб побачити вартість</span>
                  )}
                </p>
              </article>
            )
          })}
        </div>

        {typeof form.errors.items === 'string' && (
          <p className="pop-in mt-3 font-bold text-[var(--rose-ink)]">{form.errors.items}</p>
        )}

        <button
          type="button"
          className="new-order-add mt-4 w-full rounded-[var(--wobbly)] border-2 border-dashed border-[var(--ink-soft)] py-4 font-extrabold text-[var(--ink-soft)] transition-all duration-200 hover:border-[var(--stroke)] hover:bg-[var(--paper-raised)] hover:text-[var(--ink)] active:scale-[0.99]"
          onClick={addItem}
        >
          + Додати позицію
        </button>
      </section>

      <section className="new-order-total sticker bg-[var(--peach)]! grid grid-cols-1 gap-2 p-5 sm:grid-cols-3">
        <TotalValue label="Площа" value={formatArea(total.areaMm2)} />
        <TotalValue label="До оплати" value={formatArea(total.billableAreaMm2)} />
        <TotalValue label="Вартість" value={formatMoney(total.costKopecks)} strong />
        {readyPrices.length < form.values.items.length && (
          <p className="hand text-xl text-[var(--peach-ink)] sm:col-span-3">
            * враховано лише повністю заповнені позиції
          </p>
        )}
      </section>

      {saveOrder.isError && (
        <div className="pop-in sticker bg-[var(--rose)]! p-4 font-bold text-[var(--rose-ink)]">
          Не вдалося зберегти замовлення. Перевірте дані та спробуйте ще раз.
        </div>
      )}

      <Button type="submit" size="md" className="self-start" loading={saveOrder.isPending}>
        Створити замовлення
      </Button>
    </form>
  )
}
