import { getWeekday } from '@/frontend/components/date.ts'

export const Day = ({ day }: { day: Date }) => {
    // Gets the name of the current weekday
    const weekday = getWeekday(day.getDay())
    const currentDay = new Date(day)

    return (
        <div className="p-1 rounded-t-2xl pt-5 h-full w-72 bg-primary">
            <div className="flex flex-col items-center">
                <p className="font-medium">{weekday}</p>
                <p>
                    {currentDay.getDate()}.{currentDay.getMonth() + 1}.
                    {currentDay.getFullYear()}
                </p>
            </div>
        </div>
    )
}
