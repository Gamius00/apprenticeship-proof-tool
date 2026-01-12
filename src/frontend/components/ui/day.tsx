import { NewEntryDialog } from "@/frontend/components/ui/new-entry-dialog.tsx"
import { useEffect, useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { DATE_FORMATS, formatDate } from "@/shared-utils/date.ts"
import { api } from "@/shared-utils/api-path.ts"
import { IoMdClose } from "react-icons/io"
import { cn } from "@/frontend/components/lib/utils.ts"

interface getEntryData {
    date: string | undefined
    entries: string[] | undefined
}

export const Day = ({ day, isHoliday }: { day: Date; isHoliday: boolean }) => {
    const [data, setData] = useState<getEntryData | undefined>()

    const currentDay: Date = new Date(day)

    /* Gets the name of weekday (e.g. Monday, Tuesday) */
    const weekday = formatDate({
        date: currentDay,
        formatDateOption: DATE_FORMATS.LONG_WEEKDAY,
    })

    /* Manages the (close, open) state of the new entry dialog */
    const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false)

    useEffect(() => {
        if (isNewEntryDialogOpen) return

        api.post("/api/getEntry", { date: day }).then(r => setData(r.data))
    }, [day, isNewEntryDialogOpen])

    const removeEntry = (index: number) => {
        data!.entries!.splice(index, 1)

        setData({
            date: formatDate({ date: day, toISOLocale: true }),
            entries: data?.entries,
        })
        api.post("/api/deleteEntry", { index, day })
    }

    return (
        <div
            className={cn(
                "p-1 z-50 rounded-t-2xl pt-5 h-full w-72 bg-primary",
                isHoliday && "bg-secondary",
            )}
        >
            <div className="flex w-full justify-around items-center">
                <div
                    className={cn(
                        "flex flex-col ml-20 items-center",
                        isHoliday && "ml-0",
                    )}
                >
                    <p className="font-medium">{weekday}</p>
                    <p>{formatDate({ date: currentDay, region: "de-DE" })}</p>
                </div>
                {!isHoliday && (
                    <FiPlusCircle
                        onClick={() => {
                            setIsNewEntryDialogOpen(true)
                        }}
                        className="w-6 h-6"
                    />
                )}
            </div>
            <NewEntryDialog
                isOpen={isNewEntryDialogOpen}
                currentDay={currentDay}
                setIsOpen={setIsNewEntryDialogOpen}
            />

            {/** Displays if the day is a holiday*/}
            {isHoliday && (
                <div className="bold flex justify-center mt-20 text-xl">
                    <p>Feiertag</p>
                </div>
            )}

            <div className="w-full flex flex-col items-center">
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
