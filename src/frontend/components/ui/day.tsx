import { NewEntryDialog } from "@/frontend/components/ui/new-entry-dialog.tsx"
import { useEffect, useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { DATE_FORMATS, formatDate } from "@/shared-utils/date.ts"
import { api } from "@/shared-utils/api-path.ts"
import { IoIosCloseCircleOutline, IoMdClose } from "react-icons/io"
import { cn } from "@/frontend/components/lib/utils.ts"
import { DayTypes, WeekObject } from "@/shared-utils/types"

export const Day = ({
    day,
    isHoliday,
    weekObject,
}: {
    day: Date
    isHoliday: boolean
    weekObject: WeekObject | null
}) => {
    /** The data for the selected day */
    const [data, setData] = useState<DayTypes | undefined>()

    const currentDay: Date = new Date(day)

    /* Gets the name of weekday (e.g. Monday, Tuesday) */
    const weekday = formatDate({
        date: currentDay,
        formatDateOption: DATE_FORMATS.LONG_WEEKDAY,
    })

    /* Manages the (close, open) state of the new entry dialog */
    const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false)

    useEffect(() => {
        if (!isHoliday) return

        const data = {
            day: day,
            isHoliday: isHoliday,
        }

        api.post("api/storeNewWeekData", data)
    }, [day, isHoliday])

    useEffect(() => {
        if (isNewEntryDialogOpen) return

        api.post("/api/getEntry", { date: day }).then(r => setData(r.data))
    }, [day, isNewEntryDialogOpen, weekObject?.absence])

    if (!data) return

    /** This function calls the backend deleteEntry function to delete an entry with the correct index
     * @param index - The index of the entry which the user wants to delete */

    const removeEntry = (index: number) => {
        /** The optimistic updates for the user that the entry removes directly after clicking the button */
        data!.entries!.splice(index, 1)

        setData({
            date: formatDate({ date: day, toISOLocale: true }) ?? "",
            entries: data?.entries,
        })
        api.post("/api/deleteEntry", { index, day })
    }

    /** This function removes an absence from a day (e.g. Sick, Vacation)
     * for example, the user created an absence for a wrong day*/
    const removeAbsence = () => {
        setData(prev => (prev ? { ...prev, absence: undefined } : undefined))
        api.post("/api/removeAbsence", { day })
    }

    return (
        <div
            className={cn(
                "p-1 z-50 rounded-2xl lg:rounded-t-2xl pt-5 h-full lg:h-[400px] lg:w-72 bg-primary",
                (isHoliday || data.absence) && "bg-secondary",
            )}
        >
            <div className="flex w-full justify-around items-center">
                <div className={"flex flex-col ml-20 items-center"}>
                    <p className="font-medium">{weekday}</p>
                    <p>{formatDate({ date: currentDay, region: "de-DE" })}</p>
                </div>
                {!(isHoliday || data.absence) ? (
                    <FiPlusCircle
                        onClick={() => {
                            setIsNewEntryDialogOpen(true)
                        }}
                        className="w-6 h-6"
                    />
                ) : (
                    <IoIosCloseCircleOutline
                        className="w-7 h-7"
                        onClick={removeAbsence}
                    />
                )}
            </div>
            <NewEntryDialog
                isOpen={isNewEntryDialogOpen}
                currentDay={currentDay}
                setIsOpen={setIsNewEntryDialogOpen}
            />

            {/** Displays "Feiertag" if the day is a holiday*/}
            {isHoliday && (
                <div className="bold flex justify-center mt-20 text-xl">
                    <p>Feiertag</p>
                </div>
            )}

            {/** Displays the reason for the absence if the day is a holiday*/}
            {data.absence && (
                <div className="bold flex justify-center mt-20 text-xl">
                    <p>{data.absence}</p>
                </div>
            )}

            <div
                className={cn(
                    "w-full flex flex-col items-center",
                    (data.absence || data.isHoliday) && "hidden",
                )}
            >
                {!data
                    ? "Loading"
                    : data.entries?.map((entry: string, index: number) => (
                          <div
                              className={
                                  data?.entries?.length === 0
                                      ? "hidden"
                                      : "bg-secondary text-wrap justify-between items-center flex p-2 w-11/12 my-2 rounded-lg border-border border-2"
                              }
                              key={index}
                          >
                              <p className="w-11/12 overflow-hidden">{entry}</p>
                              <div>
                                  <IoMdClose
                                      onClick={() => {
                                          removeEntry(index)
                                      }}
                                  />
                              </div>
                          </div>
                      ))}
            </div>
        </div>
    )
}
