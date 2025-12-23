const DEFAULT_LOCALE = 'en-US'

interface FormatDateProps {
    date: Date | undefined
    region?: string
    formatDateOption?: Intl.DateTimeFormatOptions
}

const DATE_FORMATS: {
    DAY_MONTH_NAME_YEAR: Intl.DateTimeFormatOptions
    DAY_MONTH_NAME_WEEKDAY: Intl.DateTimeFormatOptions
    DAY_MONTH_NAME: Intl.DateTimeFormatOptions
    DAY_MONTH_YEAR: Intl.DateTimeFormatOptions
    LONG_WEEKDAY: Intl.DateTimeFormatOptions
} = {
    // For example: Tue., 11. December
    DAY_MONTH_NAME_YEAR: { day: 'numeric', month: 'long', year: 'numeric' },
    // For example: 5. December 2025
    DAY_MONTH_NAME_WEEKDAY: { day: 'numeric', month: 'long', weekday: 'short' },
    // For example: 5. December 2025
    DAY_MONTH_YEAR: { day: 'numeric', month: 'numeric', year: 'numeric' },
    // For example: 5. December
    DAY_MONTH_NAME: { day: 'numeric', month: 'long' },
    // For example: Monday
    LONG_WEEKDAY: { weekday: 'long' },
}
export { DATE_FORMATS }

/** This function calculates the monday of a week
 * @param day - Get the week for a given date
 */
export const getMonday = (day: string | number) => {
    const today = new Date(day)
    const date = today.getDay()

    /* Calculates the difference between today and the last monday */
    const diff = date === 0 ? -6 : 1 - date

    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)

    return monday
}

/** Returns an array with the work days of the current week
 * @param difference - The difference between the current week and the displayed week
 */
export const getWeek = (difference: number) => {
    const array: Date[] = []
    const day = new Date()

    const monday = getMonday(day.toISOString())

    /* Calculate all work days of the current week
     * The calculation starts on Monday and continues through Friday. **/
    for (let i = 0; i < 5; i++) {
        const newDay = new Date().setDate(monday.getDate() + i + difference)
        array.push(new Date(newDay))
    }

    return array
}

/**
 * @param formatDateOption - The Option to format the Date String
 * @param date - The Date to format
 * @param region - The format language and region
 */

export const formatDate = ({
    date,
    region = DEFAULT_LOCALE,
    formatDateOption,
}: FormatDateProps) => {
    if (!date) {
        return
    }

    /* Creates a standard locale object for the given region*/
    const locale = new Intl.Locale(region)

    return date.toLocaleDateString(locale, formatDateOption)
}
