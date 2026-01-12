export interface Day {
    date: string | undefined
    entries: string[]
}

export interface InsertDataReturn {
    weekStart: string | undefined
    weekEnd: string | undefined
    trainingLocation: string
    days: Day[]
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
}

export interface WeekViewProps {
    difference: number
    isOpen: boolean
    setWeekObject: (weekObj: WeekObject) => void
}
