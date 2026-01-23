import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/frontend/components/ui/shadcn/dialog.tsx"
import { Button } from "@/frontend/components/ui/shadcn/button.tsx"
import React, { useState } from "react"
import {
    Select,
    SelectGroup,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/frontend/components/ui/shadcn/select.tsx"
import { Checkbox } from "@/frontend/components/ui/shadcn/checkbox.tsx"
import { DateInput } from "@/frontend/components/ui/date-picker.tsx"
import { api } from "@/shared-utils/api-path.ts"
import type { AbsenceProps, DataProps, WeekObject } from "@/shared-utils/types.ts"
import { Input } from "@/frontend/components/ui/shadcn/input.tsx"
import { formatDate } from "@/shared-utils/date.ts"

interface NewEntryDialogProps {
    isOpen: boolean
    setIsOpen: (arg: boolean) => void
    weekObject: WeekObject | null
    setWeekObject: React.Dispatch<React.SetStateAction<WeekObject | null>>
}

/**
 * @param isOpen - Manage the state of the dialog (close, open)
 * @param setIsOpen - To change the state of the variable
 * @param weekObject - The data which the user wants to update
 * @param setWeekObject - The variable to change the state of the weekObject
 */

export const EditWeekDialog = ({
    isOpen,
    setIsOpen,
    setWeekObject,
    weekObject,
}: NewEntryDialogProps) => {
    /** This value contains the current state of the trainingLocation input */
    const [activityValue, setActivityValue] = useState<string | null>(null)
    /** This is the state of the checkBox if it is checked or not */
    const [isChecked, setIsChecked] = useState(false)
    /** The state of the Datepicker input for the absence begin */
    const [absenceBeginDate, setAbsenceBeginDate] = useState<string | undefined>(
        undefined,
    )
    /** The state of the Datepicker input for the absence end */
    const [absenceEndDate, setAbsenceEndDate] = useState<string | undefined>(undefined)
    /** The Reason for the absence (e.g. Sickness, Vacation) */
    const [absenceReason, setAbsenceReason] = useState<string | undefined>(undefined)

    /** This function handles the updated data after pressing the save button */
    const handleUpdateWeek = () => {
        /** This checks if all inputs are not empty */
        if ((!absenceReason || !absenceBeginDate || !absenceEndDate) && isChecked) return

        const absence: AbsenceProps = {
            start: formatDate({
                date: new Date(absenceBeginDate ?? ""),
                toISOLocale: true,
            }),
            end: formatDate({
                date: new Date(absenceEndDate ?? ""),
                toISOLocale: true,
            }),
            reason: absenceReason ?? "",
        }

        /** Optimistic Update for absence prop if the checkbox is checked*/
        if (isChecked) {
            setWeekObject((prev: WeekObject | null) =>
                prev ? { ...prev, absence: absence } : prev,
            )
        }

        if (!weekObject?.startDate) return

        const data: DataProps = {
            day: weekObject?.startDate,
            trainingLocation: activityValue,
            /** If the checkbox is checked and the inputs are not empty send the data */
            ...(isChecked && {
                absence: absence,
            }),
        }

        /** Closes the dialog */
        setIsOpen(false)

        /** Stores a new entry with the data */
        api.post("api/storeNewWeekData", data)
    }

    /** The change event for the absence reason input */
    const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAbsenceReason(event.target.value)
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                setIsOpen(!isOpen)
            }}
        >
            <DialogContent>
                <DialogTitle></DialogTitle>
                <DialogHeader>
                    <div>
                        <DialogDescription className="mt-4 mb-2">
                            Activity
                        </DialogDescription>
                        <Select>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        activityValue ??
                                        weekObject?.trainingLocation ??
                                        "Communardo Software"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem
                                        value="company"
                                        onMouseDownCapture={() => {
                                            setActivityValue("Communardo Software")
                                        }}
                                    >
                                        Communardo Software
                                    </SelectItem>
                                    <SelectItem
                                        onMouseDownCapture={() => {
                                            setActivityValue("School")
                                        }}
                                        value="school"
                                    >
                                        School
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>{" "}
                    </div>
                    <div className="flex flex-row items-center">
                        <DialogDescription className="mt-4">Absence</DialogDescription>
                        <Checkbox
                            className="mt-5 ml-3"
                            checked={isChecked}
                            onClick={() => {
                                setIsChecked(!isChecked)
                            }}
                        />
                    </div>
                    {isChecked && (
                        <div className="text-text">
                            <div>
                                <p className="my-1">Start</p>
                                <DateInput
                                    value={absenceBeginDate}
                                    setValue={setAbsenceBeginDate}
                                />
                            </div>

                            <div>
                                <p className="my-1">End</p>
                                <DateInput
                                    value={absenceEndDate}
                                    setValue={setAbsenceEndDate}
                                />
                            </div>

                            <div>
                                <p className="my-1">Reason</p>
                                <Input
                                    className="text-black bg-text"
                                    value={absenceReason}
                                    onChange={event => {
                                        handleReasonChange(event)
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </DialogHeader>
                <Button
                    onClick={() => {
                        handleUpdateWeek()
                    }}
                    className="text-text"
                >
                    Save
                </Button>
            </DialogContent>
        </Dialog>
    )
}
