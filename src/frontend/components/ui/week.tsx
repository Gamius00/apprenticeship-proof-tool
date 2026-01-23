import { Day } from "@/frontend/components/ui/day.tsx"
import { formatDate, getWeek } from "@/shared-utils/date.ts"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import type { Holiday, WeekViewProps } from "@/shared-utils/types.ts"

export const WeekView = ({ difference, setWeekObject, weekObject }: WeekViewProps) => {
    /** Gets an object with the days of the current week
     * using useMemo to storage the rendered state and only update it
     * if the state changes, useMemo checks if previous state is changed */
    const week = useMemo(() => getWeek(difference), [difference])
    /** Stores the fetched array with the holidays of the week*/
    const [holidayData, setHolidayData] = useState<Holiday[] | undefined>(undefined)

    /** Changes the week object if the week or the data changes */
    useEffect(() => {
        const result = getWeek(difference)

        // Sets the Week Object to the first and last day of the week
        setWeekObject({
            startDate: result[0],
            endDate: result[result.length - 1],
        })
    }, [difference, setWeekObject])

    /** Checks if the current day is a holiday in saxony (SN = Saxony) */
    const isHolidayForSN = (holiday: Holiday, date: string | undefined) =>
        (holiday.nationwide ||
            holiday.subdivisions.some(sub => sub.shortName === "SN")) &&
        holiday.startDate === date

    useEffect(() => {
        /** Fetches the holidays for the current week */
        axios
            .get(
                `https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&languageIsoCode=DE&validFrom=${formatDate({ date: week[0], toISOLocale: true })}&validTo=${formatDate({ date: week[week.length - 1], toISOLocale: true })}`,
            )
            .then(r => setHolidayData(r.data))
    }, [week])

    return (
        <>
            <div className="flex flex-wrap h-full gap-4 justify-around">
                {week.map((day, index) => {
                    const isoDay = formatDate({ date: day, toISOLocale: true })

                    /** Checks if a holiday matches the current day */
                    const isHoliday = holidayData?.some(holiday =>
                        isHolidayForSN(holiday, isoDay),
                    )

                    return (
                        <div key={index}>
                            <Day
                                day={day}
                                isHoliday={isHoliday !== undefined && isHoliday}
                                weekObject={weekObject}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    )
}
