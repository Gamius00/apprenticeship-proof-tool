import { NewEntryDialog } from '@/frontend/components/ui/new-entry-dialog.tsx'
import { useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import { FaRegEdit } from 'react-icons/fa'
import { DATE_FORMATS, formatDate } from '@/shared-utils/date.ts'

export const Day = ({ day }: { day: Date }) => {
    /* Gets the name of the current weekday */
    const currentDay: Date = new Date(day)

    /* Gets the name of weekday (e.g. Monday, Tuesday) */
    const weekday = formatDate({
        date: currentDay,
        formatDateOption: DATE_FORMATS.LONG_WEEKDAY,
    })

    /* Manages the (close, open) state of the new entry dialog */
    const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false)

    return (
        <div className="p-1 z-50 rounded-t-2xl pt-5 h-full w-72 bg-primary">
            <div className="flex w-full justify-around items-center">
                <FaRegEdit className="w-6 h-6" />
                <div className="flex flex-col items-center">
                    <p className="font-medium">{weekday}</p>
                    <p>{formatDate({ date: currentDay, region: 'de-DE' })}</p>
                </div>
                <FiPlusCircle
                    onClick={() => {
                        setIsNewEntryDialogOpen(true)
                    }}
                    className="w-6 h-6"
                />
            </div>
            <NewEntryDialog
                isOpen={isNewEntryDialogOpen}
                currentDay={currentDay}
                setIsOpen={setIsNewEntryDialogOpen}
            />
        </div>
    )
}
