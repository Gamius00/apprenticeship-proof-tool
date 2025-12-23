import { Day } from '@/frontend/components/ui/day.tsx'
import { getWeek } from '@/shared-utils/date.ts'
import { useEffect } from 'react'

interface WeekViewProps {
    difference: number
    setWeekObject: (weekObj: { startDate: Date; endDate: Date }) => void
}

export const WeekView = ({ difference, setWeekObject }: WeekViewProps) => {
    // Gets an object with the days of the current week
    const week = getWeek(difference)

    useEffect(() => {
        const result = getWeek(difference)

        // Sets the Week Object to the first and last day of the week
        setWeekObject({ startDate: result[0], endDate: result[result.length - 1] })
    }, [difference, setWeekObject])

    return (
        <>
            <div className="flex h-screen gap-4 justify-around w-screen overflow-hidden">
                {week.map((day, index) => {
                    return (
                        <div key={index}>
                            <Day day={day} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}
