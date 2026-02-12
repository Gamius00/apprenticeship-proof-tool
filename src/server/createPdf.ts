import fs from "fs"
import path from "path"
import { PDFDocument, rgb } from "pdf-lib"
import { DATE_FORMATS, formatDate } from "../shared-utils/date.ts"
import {
    calculateWeeksSinceBegin,
    getMetaData,
    getWeekData,
} from "../server/storage-data.ts"
import type { InsertDataReturn } from "@/shared-utils/types.ts"

/** This function creates an PDF for the selected week with the storaged data
 * @param data.weekStart - The Monday of the current week
 * @param data.weekEnd - The Friday of the current week */

export const createPdf = async (data: { weekStart: string; weekEnd: string }) => {
    const pdfPath = path.join("public/ihk-template.pdf")
    /** Gets the pfd template */
    const existingPdfBytes = fs.readFileSync(pdfPath)

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    /** Takes the first page of the pdf */
    const page = pdfDoc.getPage(0)

    /** Contains the proofNumber of this week */
    const proofNumber = calculateWeeksSinceBegin(new Date(data.weekStart))
    /** Contains the metaData of the project (e.g. name, apprenticeShipBegin) */
    const metaData: { name: string; apprenticeShipBegin: string } = getMetaData()
    /** The data for the current week (e.g. days, entries) */
    const weekData: InsertDataReturn = getWeekData(proofNumber)
    /** Total working hours for the week */
    let totalWorkingHours: number = 0

    /** The start position for drawing text every day*/
    const startPositions = [
        { y: 757, x: 95 },
        { y: 647, x: 95 },
        { y: 538, x: 95 },
        { y: 429, x: 95 },
        { y: 321, x: 95 },
    ]

    /** writes the text for the end date for the week*/
    page.drawText(
        formatDate({
            date: new Date(data.weekEnd),
            formatDateOption: DATE_FORMATS.DAY_MONTH_YEAR,
            region: "de-DE",
        }) ?? "",
        {
            x: 289,
            y: 780,
            size: 12,
            color: rgb(0, 0, 0),
        },
    )

    /** writes the text for the start date for the week */
    page.drawText(
        formatDate({
            date: new Date(data.weekStart),
            formatDateOption: DATE_FORMATS.DAY_MONTH_YEAR,
            region: "de-DE",
        }) ?? "",
        {
            x: 183,
            y: 780,
            size: 12,
            color: rgb(0, 0, 0),
        },
    )

    /** writes the text for the name of the user */
    page.drawText(metaData.name, {
        x: 370,
        y: 807,
        size: 12,
        color: rgb(0, 0, 0),
    })

    /** Writes the proof number (Ausbildungsnachweis) for the current week */
    page.drawText(proofNumber.toString(), {
        x: 289,
        y: 807,
        size: 12,
        color: rgb(0, 0, 0),
    })

    /** This draws and calculates every position for the which have to be stored */
    weekData.days.map((entry, index) => {
        /** Draws every stored entry for the day starts with the starting position */

        /** Increase total working hours for every day */
        totalWorkingHours = totalWorkingHours + (entry.workingHours ?? 8)

        /** Draws the working Hours for every day of the week */
        page.drawText((entry.workingHours ?? 8).toString(), {
            x: startPositions[index].x + 430,
            y: startPositions[index].y - 70,
            size: 12,
            color: rgb(0, 0, 0),
        })

        /** If a day of the week is holiday -> write "Feiertag"
         * else if absence is defined write the value of the variable */
        if (entry.isHoliday || entry.absence) {
            page.drawText(entry.isHoliday ? "Feiertag" : (entry.absence ?? ""), {
                x: startPositions[index].x + 120,
                y: startPositions[index].y - 36,
                size: 12,
                color: rgb(0, 0, 0),
            })

            /** If there was already an entry, hide this entry by leaving this
             * map function, so no entry can be rendered */
            return
        }

        entry.entries.map(item => {
            /** Sets the margin -18 (e.g. Entry 1: y: 300, Entry 2: y: 282)*/
            startPositions[index].y = startPositions[index].y - 18

            page.drawText(item, {
                x: startPositions[index].x,
                y: startPositions[index].y,
                size: 12,
                color: rgb(0, 0, 0),
            })
        })
    })

    //** Draws the total working hours of the week */
    page.drawText(totalWorkingHours.toString(), {
        x: 519,
        y: 175,
        size: 12,
        color: rgb(0, 0, 0),
    })

    /** Returns the saved pdf */
    return await pdfDoc.save()
}
