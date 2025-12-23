import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/frontend/components/ui/shadcn/dialog.tsx'
import { Input } from '@/frontend/components/ui/shadcn/input.tsx'
import { Button } from '@/frontend/components/ui/shadcn/button.tsx'
import { api } from '@/shared-utils/api-path.ts'
import { DATE_FORMATS, formatDate } from '@/shared-utils/date.ts'
import React, { useState } from 'react'

interface NewEntryDialogProps {
    isOpen: boolean
    setIsOpen: (arg: boolean) => void
    currentDay: Date
}

/**
 * @param isOpen - Manage the state of the dialog (close, open)
 * @param setIsOpen - To change the state of the variable
 * @param currentDay - Contains the name of weekday (e.g. Monday)
 */

export const NewEntryDialog = ({
    isOpen,
    setIsOpen,
    currentDay,
}: NewEntryDialogProps) => {
    const [activityValue, setActivityValue] = useState('')

    const handleFormSubmit = () => {
        setIsOpen(false)
        api.post('api/storeNewEntry', { day: currentDay, value: activityValue }).then(r =>
            console.log(r),
        )
    }

    const onActivityValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActivityValue(e.target.value)
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                setIsOpen(!isOpen)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        New Entry for{' '}
                        {formatDate({
                            date: currentDay,
                            formatDateOption: DATE_FORMATS.LONG_WEEKDAY,
                        })}
                    </DialogTitle>
                    <div>
                        <DialogDescription className="mt-4">Activity</DialogDescription>
                        <Input
                            value={activityValue}
                            onChange={onActivityValueChange}
                            className="text-black bg-text mt-1"
                        />
                    </div>
                </DialogHeader>
                <Button onClick={handleFormSubmit} className="text-text">
                    Save
                </Button>
            </DialogContent>
        </Dialog>
    )
}
