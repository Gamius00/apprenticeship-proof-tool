export interface DayTypes {
    date: string
    entries: string[]
    absence?: string
    isHoliday?: boolean
}

export interface DataProps {
    day: Date
    trainingLocation: string | null
    isHoliday?: boolean
    value?: string
    absence?: AbsenceProps
}

export interface AbsenceProps {
    end: string | undefined
    start: string | undefined
    reason: string
}

export interface InsertDataReturn {
    weekStart: string | undefined
    weekEnd: string | undefined
    trainingLocation: string
    days: DayTypes[]
}

export interface Holiday {
    endDate: string
    id: string
    name: { text: string; language: string }[]
    nationwide: boolean
    startDate: string
    subdivisions: { code: string; shortName: string }[]
    temporalScope: string
}

export interface WeekObject {
    startDate: Date
    endDate: Date
    trainingLocation?: string
    absence?: AbsenceProps
}

export interface WeekViewProps {
    difference: number
    isOpen: boolean
    weekObject: WeekObject | null
    setWeekObject: (weekObj: WeekObject) => void
}
