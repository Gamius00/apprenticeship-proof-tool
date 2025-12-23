import fs from 'fs'
import path from 'path'
import { getMonday } from '../shared-utils/date.ts'

const filePath = path.join('src/server/data/')

// Get the data from the JSON File
export function getMetaData() {
    return JSON.parse(fs.readFileSync(filePath + 'data.json', 'utf-8'))
}

// Checks if the JSON file already exists
export function isJsonReady() {
    return fs.existsSync(filePath + 'data.json')
}

/** Create the JSON setup
 * @param data - Object that contains name of the current user and the apprenticeShipBegin
 * */
export function setup(data: { name: string; apprenticeShipBegin: Date }) {
    fs.writeFileSync(filePath + 'data.json', JSON.stringify(data))
}

/** This function calculate the week since the apprenticeship beginning */
const calculateWeeksSinceBegin = (day: Date) => {
    /* This value stores the apprenticeship begin date */
    const dayBegin: { apprenticeShipBegin: string; name: string } = getMetaData()

    /* This stores the calculated time in milliseconds of the beginning day */
    const beginTime = new Date(getMonday(dayBegin.apprenticeShipBegin)).getTime()

    /* This stores the calculated time in milliseconds of the current day */
    const currentDay = new Date(getMonday(day.toString())).getTime()

    /* The result calculates the time since the apprenticeship starts in milliseconds and divide
     * it by the number of days in a week in milliseconds. Then we increase the result by 1, because
     * the first apprenticeship week is also included */
    return Math.floor((currentDay - beginTime) / (1000 * 60 * 60 * 24 * 7) + 1)
}

export function storesNewEntry(data: { day: Date; value: string }) {
    const proofNumber = calculateWeeksSinceBegin(data.day)

    fs.writeFileSync(
        filePath + `weeks/week-${proofNumber}.json`,
        JSON.stringify(data.value),
    )

    return
}
