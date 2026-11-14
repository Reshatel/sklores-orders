import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core'

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const currentScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  function toggleTheme() {
    setColorScheme(currentScheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      className="theme-toggle sticker-button relative grid h-10 w-10 place-items-center overflow-hidden"
      onClick={toggleTheme}
      aria-label="Перемкнути тему"
    >
      <svg
        className="theme-toggle-sun absolute h-6 w-6 transition-all duration-500 ease-[var(--spring)] dark:rotate-90 dark:scale-0 dark:opacity-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4.2" fill="var(--butter)" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
      </svg>
      <svg
        className="theme-toggle-moon absolute h-6 w-6 -rotate-90 scale-0 opacity-0 transition-all duration-500 ease-[var(--spring)] dark:rotate-0 dark:scale-100 dark:opacity-100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" fill="var(--lavender)" />
      </svg>
    </button>
  )
}
