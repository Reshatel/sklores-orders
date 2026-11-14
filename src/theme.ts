import { createTheme } from '@mantine/core'
import type { MantineColorsTuple } from '@mantine/core'

const mint: MantineColorsTuple = [
  '#ecfaf2',
  '#d9f2e4',
  '#b3e5c9',
  '#8ad8ad',
  '#68cc95',
  '#52c486',
  '#45c07d',
  '#35a96a',
  '#2a965d',
  '#1a824e',
]

export const theme = createTheme({
  primaryColor: 'mint',
  primaryShade: { light: 2, dark: 8 },
  colors: { mint },
  fontFamily: 'Nunito, system-ui, sans-serif',
  headings: { fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: '800' },
  defaultRadius: 'lg',
  cursorType: 'pointer',
})
