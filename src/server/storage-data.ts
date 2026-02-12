import fs from "fs"
import path from "path"
import { formatDate, getMonday, getWeek } from "../shared-utils/date.ts"
import type { DataProps, DayTypes, InsertDataReturn } from "../shared-utils/types.ts"

const metaDataPath = path.join("src/server/data/")
const weekDataPath = path.join("src/server/data/weeks/")

interface insertDataProps {
    date: Date
    trainingLocation?: string
}

/** Creates a valid date and gets the timestamp */
const toTime = (date: string | Date) => new Date(date).getTime()

/** This function removes an absence from a day from the backend (e.g. Sick, Vacation)
 * for example, the user created an absence for a wrong day*/
export const removeAbsence = ({ day }: { day: Date }) => {
    const proofNumber = calculateWeeksSinceBegin(day)
    const weekData: InsertDataReturn = getWeekData(proofNumber)

    /** Format the date in the correct format */
    const formatedDay = formatDate({ date: day, toISOLocale: true })

    /** Storages the returned matched object from the function */
    const newWeekData = weekDayMatch(weekData, formatedDay)

    /** Checks if we got a match */
    if (!newWeekData) return

    /** set absence to undefined */
    newWeekData.absence = undefined

    /** Update the new Data */
    upsertWeek(proofNumber, weekData)
}

/** This function calculates the data you have to store for every week
 * @param date - The selected day of the current week
 * @param trainingLocation - The location of the week (e.g. School, Company)
 * @returns { InsertDataReturn } */

const insertData = ({ date, trainingLocation }: insertDataProps): InsertDataReturn => {
    /** This function calculates the Week offset in days*/
    const weekOffset =
        (calculateWeeksSinceBegin(date) - calculateWeeksSinceBegin(new Date())) * 7

    /** Gets an array with the work days of the current week*/
    const weekData = getWeek(weekOffset)

    return {
        weekStart: formatDate({ date: weekData[0], toISOLocale: true }),
        weekEnd: formatDate({ date: weekData[weekData.length - 1], toISOLocale: true }),
        trainingLocation: trainingLocation ?? "Communardo Software",
        days: weekData.map(date => {
            return {
                date: formatDate({ date: date, toISOLocale: true }) ?? "",
                workingHours: 8,
                entries: [],
            }
        }),
    }
}

/** Get the data from the JSON File */
export function getMetaData() {
    return JSON.parse(fs.readFileSync(metaDataPath + "data.json", "utf-8"))
}

/** Checks if the JSON file already exists */
export function isJsonReady() {
    return fs.existsSync(metaDataPath + "data.json")
}

/** Create the JSON setup
 * @param data - Object that contains name of the current user and the apprenticeShipBegin
 * */
export function setup(data: { name: string; apprenticeShipBegin: Date }) {
    fs.writeFileSync(metaDataPath + "data.json", JSON.stringify(data))
}

/** This function calculate the week since the apprenticeship beginning */
export const calculateWeeksSinceBegin = (day: Date) => {
    /* This value stores the apprenticeship begin date */
    const dayBegin: { apprenticeShipBegin: string; name: string } = getMetaData()

    /* This stores the calculated time in milliseconds of the beginning day */
    const beginTime = toTime(getMonday(dayBegin.apprenticeShipBegin))

    /* This stores the calculated time in milliseconds of the current day */
    const currentDay = toTime(getMonday(day.toString()))

    /* The result calculates the time since the apprenticeship starts in milliseconds and divide
     * it by the number of days in a week in milliseconds. Then we increase the result by 1, because
     * the first apprenticeship week is also included */
    return Math.floor((currentDay - beginTime) / (1000 * 60 * 60 * 24 * 7) + 1)
}

export function getWeekData(proofNumber: number) {
    return JSON.parse(
        fs.readFileSync(weekDataPath + `/week-${proofNumber}.json`, "utf-8"),
    )
}

/** This function checks if the given week exists
 * @param proofNumber - The number of the week since the beginning og the apprenticeship
 */
const doesWeekExist = (proofNumber: number) => {
    return fs.existsSync(weekDataPath + `week-${proofNumber}.json`)
}

export const resolveWeekData = ({ date }: { date: Date }) => {
    const proofNumber = calculateWeeksSinceBegin(date)
    const weekDataExists = doesWeekExist(proofNumber)

    if (!weekDataExists) return {}

    return getWeekData(proofNumber)
}

/** Inserts or update data for the selected week
 * @param proofNumber - The number of the week since the beginning of the apprenticeship
 * @param data - The data which the user wants to update
 */
const upsertWeek = (proofNumber: number, data?: InsertDataReturn) => {
    fs.writeFileSync(weekDataPath + `week-${proofNumber}.json`, JSON.stringify(data))
}

/** Checks which date matches the day the user want to update
 * @param weekData - Contains the whole data for the selected week
 * @param day - The day the user wants to update */
const weekDayMatch = (weekData: InsertDataReturn, day: string | undefined) => {
    return weekData.days.find((entry: DayTypes) => entry.date === day)
}

/** This func creates a new entry for a selected day
 * @param data.day - The day you want to store an entry for
 * @param data.value - The text you want to store
 * @param data.workingHours - The workingHours of the current day
 * @param data.trainingsLocation - The trainingsLocation for the selected week */

export function storesNewWeekData(data: DataProps) {
    const proofNumber = calculateWeeksSinceBegin(data.day)
    const weekExists = doesWeekExist(proofNumber)

    /** Checks if already an entry is stored for this week, if not create one */
    if (!weekExists) {
        upsertWeek(proofNumber, insertData({ date: data.day }))
    }

    /** Gets the already existing data of the current week */
    const weekData = getWeekData(proofNumber)

    /** The day to insert the data which the user wants to storage */
    const dayToInsert = formatDate({ date: data.day, toISOLocale: true })
    /** Searches for the date in the array that matches the selected date. */
    const newWeekData = weekDayMatch(weekData, dayToInsert)

    if (!newWeekData) return

    /** If the updated data object contains the trainingLocation update this too */
    if (data.trainingLocation) {
        weekData.trainingLocation = data.trainingLocation
    }

    /** If the selected day is a holiday in saxony set isHoliday = true */
    if (data.isHoliday) {
        newWeekData.isHoliday = true
        /** Sets the working hour to 0 */
        newWeekData.workingHours = 0
    }

    if (data.absence) {
        /** Checks if start and end date is defined */
        if (!data.absence.start || !data.absence.end) return

        /** The timestamp for the absence end date */
        const end = toTime(data.absence.end)

        /** The timestamp for the absence start date */
        const start = toTime(data.absence.start)

        /** Checks each day to see if its timestamp falls within the start and end range */
        weekData.days.map((entry: DayTypes) => {
            const currentDay = toTime(entry.date)

            if (start <= currentDay && currentDay <= end) {
                /** Sets the reason for the absence */
                entry.absence = data.absence?.reason

                /** Sets the working hour to 0 */
                entry.workingHours = 0
            }
        })
    }

    if (data.value) {
        /** Add the new entry to the data */
        newWeekData.entries.push(data.value)
    }

    upsertWeek(proofNumber, weekData)

    return true
}

/** This function deletes an entry for the day
 * @param day - The day you want to delete an entry for
 * @param index - The index in the entry list you want to delete */

export const deleteEntry = ({ day, index }: { day: Date; index: number }) => {
    const proofNumber = calculateWeeksSinceBegin(day)
    const weekExists = doesWeekExist(proofNumber)

    if (!weekExists) {
        console.error("Something went wrong")
    }

    /** Reads the json file */
    const weekData = getWeekData(proofNumber)

    /** Creates the new edited Entry */
    const element = weekData.days.find(
        (dayObject: { date: Date; entries: string[] }) =>
            formatDate({ date: dayObject.date, toISOLocale: true }) ===
            formatDate({ date: day, toISOLocale: true }),
    )

    /** Deletes the entry with the correct index */
    element.entries.splice(index, 1)

    /** Update the data for the selected week */
    upsertWeek(proofNumber, weekData)

    return true
}

/** Get entry's for the given date
 * @param date - The selected day */

export function getEntry({ date }: { date: Date }) {
    /** Calculates the proof number*/
    const proofNumber = calculateWeeksSinceBegin(date)
    /** Check if already a json file exist for the given week */
    const weekExists = doesWeekExist(proofNumber)

    if (!weekExists) {
        return { entries: [] }
    }

    /** Reads the json file */
    const weekData = getWeekData(proofNumber)

    /** Return the object for the selected day with the entry`s */
    return weekData.days.find(
        (day: { date: Date; entries: string[] }) =>
            formatDate({ date: day.date, toISOLocale: true }) ===
            formatDate({ date, toISOLocale: true }),
    )
}
