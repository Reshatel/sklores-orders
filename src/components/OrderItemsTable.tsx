import { Table } from '@mantine/core'
import { ITEMS_TABLE_MIN_WIDTH, ROW_STAGGER_MS } from '../config'
import { formatArea, formatMoney, formatPrice, formatSize } from '../lib/format'
import { getItemPrice, sumPrices } from '../lib/pricing'
import type { ItemPrice } from '../lib/pricing'
import type { OrderItem } from '../types'

function BillableArea({ price }: { price: ItemPrice }) {
  const isRaisedToMinimum = price.billableAreaMm2 > price.areaMm2
  if (!isRaisedToMinimum) return formatArea(price.billableAreaMm2)

  return (
    <span className="billable-raised inline-flex flex-col items-end leading-tight">
      <span className="rounded-md bg-[var(--peach)] px-1.5 font-extrabold text-[var(--peach-ink)]">
        {formatArea(price.billableAreaMm2)}
      </span>
      <span className="hand text-base text-[var(--peach-ink)]">мін. 0,5 м² за шт</span>
    </span>
  )
}

export function OrderItemsTable({ items }: { items: OrderItem[] }) {
  const rows = items.map((item) => ({
    item,
    price: getItemPrice({
      width: item.width,
      height: item.height,
      quantity: item.quantity,
      pricePerM2: item.glassType.pricePerM2,
    }),
  }))
  const total = sumPrices(rows.map((row) => row.price))

  return (
    <Table.ScrollContainer className="order-items-table" minWidth={ITEMS_TABLE_MIN_WIDTH}>
      <Table verticalSpacing="md" horizontalSpacing="md" className="items-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Тип скла</Table.Th>
            <Table.Th>Розмір, мм</Table.Th>
            <Table.Th className="text-right">К-сть</Table.Th>
            <Table.Th className="text-right">Площа</Table.Th>
            <Table.Th className="text-right">До оплати</Table.Th>
            <Table.Th className="text-right">Ціна за м²</Table.Th>
            <Table.Th className="text-right">Вартість</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map(({ item, price }, index) => (
            <Table.Tr
              key={item.id}
              className="order-items-row rise-in"
              style={{ animationDelay: `${(index + 1) * ROW_STAGGER_MS}ms` }}
            >
              <Table.Td>{item.glassType.name}</Table.Td>
              <Table.Td className="whitespace-nowrap">{formatSize(item.width, item.height)}</Table.Td>
              <Table.Td className="text-right">{item.quantity}</Table.Td>
              <Table.Td className="whitespace-nowrap text-right">{formatArea(price.areaMm2)}</Table.Td>
              <Table.Td className="whitespace-nowrap text-right">
                <BillableArea price={price} />
              </Table.Td>
              <Table.Td className="whitespace-nowrap text-right">
                {formatPrice(item.glassType.pricePerM2)}
              </Table.Td>
              <Table.Td className="whitespace-nowrap text-right">{formatMoney(price.costKopecks)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot className="order-items-total font-black">
          <Table.Tr>
            <Table.Td colSpan={3}>Разом</Table.Td>
            <Table.Td className="whitespace-nowrap text-right">{formatArea(total.areaMm2)}</Table.Td>
            <Table.Td className="whitespace-nowrap text-right">
              {formatArea(total.billableAreaMm2)}
            </Table.Td>
            <Table.Td />
            <Table.Td className="whitespace-nowrap text-right">{formatMoney(total.costKopecks)}</Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </Table.ScrollContainer>
  )
}
