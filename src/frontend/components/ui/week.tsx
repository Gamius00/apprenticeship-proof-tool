import { Day } from '@/frontend/components/ui/day.tsx'
import { getWeek } from '@/frontend/components/date.ts'
import { useEffect } from 'react'

interface WeekViewProps {
    difference: number
    setWeekObject: (weekObj: { startDate: Date; endDate: Date }) => void
}

export const WeekView = ({ difference, setWeekObject }: WeekViewProps) => {
    const week = getWeek(difference)

    useEffect(() => {
        const result = getWeek(difference)
        setWeekObject({ startDate: result[0], endDate: result[result.length - 1] })
    }, [difference, setWeekObject])

    console.log(week)

    return (
        <>
            <div className="flex">
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
