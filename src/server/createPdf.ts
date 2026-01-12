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

export const createPdf = async (data: { weekStart: string; weekEnd: string }) => {
    const pdfPath = path.join("public/ihk-template.pdf")
    const existingPdfBytes = fs.readFileSync(pdfPath)

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const page = pdfDoc.getPage(0)

    const proofNumber = calculateWeeksSinceBegin(new Date(data.weekStart))
    const metaData: { name: string; apprenticeShipBegin: string } = getMetaData()
    const weekData: InsertDataReturn = getWeekData(proofNumber)

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

    page.drawText(metaData.name, {
        x: 370,
        y: 807,
        size: 12,
        color: rgb(0, 0, 0),
    })

    page.drawText(proofNumber.toString(), {
        x: 289,
        y: 807,
        size: 12,
        color: rgb(0, 0, 0),
    })

    const startPositions = [
        { y: 757, x: 95 },
        { y: 647, x: 95 },
        { y: 538, x: 95 },
        { y: 429, x: 95 },
        { y: 321, x: 95 },
    ]

    weekData.days.map((entry, index) => {
        entry.entries.map(item => {
            startPositions[index].y = startPositions[index].y - 18

            page.drawText(item, {
                x: startPositions[index].x,
                y: startPositions[index].y,
                size: 12,
                color: rgb(0, 0, 0),
            })
        })
    })

    return await pdfDoc.save()
}
