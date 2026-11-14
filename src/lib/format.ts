import {
  AREA_LABEL,
  CURRENCY_LABEL,
  DATE_TIME_ZONE,
  KOPECKS_IN_HRYVNIA,
  MM2_IN_M2,
} from '../config'
import { roundDivide } from './pricing'

const NBSP = ' '
const HUNDREDTHS_IN_M2 = 100

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  timeZone: DATE_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function groupThousands(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}

function formatHundredths(hundredths: number) {
  const whole = Math.floor(hundredths / 100)
  const fraction = String(hundredths % 100).padStart(2, '0')
  return `${groupThousands(whole)},${fraction}`
}

export function formatMoney(kopecks: number) {
  return `${formatHundredths(kopecks)}${NBSP}${CURRENCY_LABEL}`
}

export function formatPrice(hryvnias: number) {
  return formatMoney(Math.round(hryvnias * KOPECKS_IN_HRYVNIA))
}

export function formatArea(areaMm2: number) {
  const hundredths = roundDivide(areaMm2, MM2_IN_M2 / HUNDREDTHS_IN_M2)
  return `${formatHundredths(hundredths)}${NBSP}${AREA_LABEL}`
}

export function formatDate(isoDate: string) {
  const parts = dateFormatter.formatToParts(new Date(isoDate))
  const day = parts.find((part) => part.type === 'day')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const year = parts.find((part) => part.type === 'year')?.value
  return `${day}.${month}.${year}`
}

export function formatSize(width: number, height: number) {
  return `${width}${NBSP}×${NBSP}${height}`
}
