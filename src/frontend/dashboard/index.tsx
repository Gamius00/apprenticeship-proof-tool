"use client"

import { useEffect, useState } from "react"
import { BiExport } from "react-icons/bi"
import { FaRegEdit } from "react-icons/fa"
import { api } from "@/shared-utils/api-path.ts"
import { MdOutlineArrowDropDownCircle } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { WeekView } from "@/frontend/components/ui/week.tsx"
import { EditWeekDialog } from "@/frontend/components/ui/edit-week-dialog.tsx"
import { WeekObject } from "@/shared-utils/types.ts"

interface Data {
    name: string
    year: number
}

export default function Dashboard() {
    /* Gets the metadata (e.g. Name) **/
    const [data, setData] = useState<Data | null>(null)
    /* the offset between the current week and the week shown in the application **/
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()
    /** The data for the first and last day of the current week */
    const [weekObject, setWeekObject] = useState<WeekObject | null>(null)
    /** Manages the open close state of the edit week dialog */
    const [isEditWeekDialogOpen, setIsWeekDialogOpen] = useState<boolean>(false)

    useEffect(() => {
        // Ensures that the user stays on the correct page
        api.get("/api/ready").then(r => {
            if (!r.data) navigate("/signup")
        })

        api.get("/api/getMetaData").then(r => setData(r.data))
    }, [])

    /** This useEffect gets the weekData for the selected week */
    useEffect(() => {
        if (!weekObject?.startDate) return

        const payload = {
            date: weekObject?.startDate,
        }

        api.post("api/getWeekData", payload).then(r => {
            /** Update the trainingLocation from the weekObject */
            setWeekObject(prevState => {
                /** Checks if already a state is storaged */
                if (!prevState) return null

                return {
                    ...prevState,
                    trainingLocation: r.data.trainingLocation,
                }
            })
        })
    }, [isEditWeekDialogOpen, offset, weekObject?.startDate])

    /** This function creates a pdf with the data which the user storaged */
    const createPdf = async () => {
        /** The week, which the pdf is for */
        const data = {
            weekStart: weekObject?.startDate,
            weekEnd: weekObject?.endDate,
        }
        const response = await api.post("pdf", data, {
            responseType: "blob",
        })

        /** Gets the data from the backend */
        const blob = await response.data
        /** Converts the binary data to e.g. usable URL */
        const url = URL.createObjectURL(blob)

        /** Opens the URL (PDF) in the Browser */
        window.open(url)
    }

    return (
        <div className="bg-background w-screen h-screen flex flex-col gap-40 text-text pt-3">
            <div className="flex justify-around">
                <div className="flex gap-10">
                    <div
                        onClick={() => {
                            createPdf()
                        }}
                        className="flex flex-col items-center"
                    >
                        <BiExport className="h-6 w-6" />
                        <p className="text-xs">Export</p>
                    </div>
                </div>
                <div className="font-medium pt-3">
                    {data ? <p>{data.name}</p> : "Loading"}
                </div>
                <div
                    className="flex gap-10"
                    onClick={() => {
                        setIsWeekDialogOpen(true)
                    }}
                >
                    <div className="flex flex-col items-center">
                        <FaRegEdit className="h-6 w-6" />
                        <p className="text-xs">Edit Week</p>
                    </div>
                    <img
                        src="communardo-logo.png"
                        alt="Communardo Logo"
                        className="h-8 w-14 lg:absolute right-8"
                    />
                </div>
            </div>
            <div className="flex justify-around">
                <MdOutlineArrowDropDownCircle
                    onClick={() => {
                        setOffset(offset - 7)
                    }}
                    className="rotate-90 mr-24 h-8 w-8"
                />
                <div className="flex-col items-center flex">
                    <p className="font-medium">
                        {weekObject?.trainingLocation ?? "Communardo Software"}
                    </p>
                    <p className="text-lg mt-1 font-medium">
                        {weekObject &&
                            `${weekObject.startDate.getDate()}.${weekObject.startDate.getMonth() + 1}.${weekObject.startDate.getFullYear()}`}{" "}
                        -{" "}
                        {weekObject &&
                            `${weekObject.endDate.getDate()}.${weekObject.endDate.getMonth() + 1}.${weekObject.endDate.getFullYear()}`}
                    </p>
                </div>
                <MdOutlineArrowDropDownCircle
                    onClick={() => {
                        setOffset(offset + 7)
                    }}
                    className="ml-24 -rotate-90 h-8 w-8"
                />
            </div>
            <WeekView
                difference={offset}
                isOpen={isEditWeekDialogOpen}
                setWeekObject={setWeekObject}
            />
            <EditWeekDialog
                isOpen={isEditWeekDialogOpen}
                setIsOpen={setIsWeekDialogOpen}
                weekObject={weekObject}
            />
        </div>
    )
}
