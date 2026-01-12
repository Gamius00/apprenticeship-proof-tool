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

interface NewEntryDialogProps {
    isOpen: boolean
    setIsOpen: (arg: boolean) => void
    currentWeek: Date[]
    trainingLocation: string | null
}

/**
 * @param isOpen - Manage the state of the dialog (close, open)
 * @param setIsOpen - To change the state of the variable
 * @param currentWeek - An array with the days of the current week
 * @param trainingLocation - The learning location from the user (e.g. school, company)
 */

export const EditWeekDialog = ({
    isOpen,
    setIsOpen,
    currentWeek,
    trainingLocation,
}: NewEntryDialogProps) => {
    const [activityValue, setActivityValue] = useState<string | null>(null)
    const [isChecked, setIsChecked] = useState(false)
    const [absenceBeginDate, setAbsenceBeginDate] = useState<string | undefined>("")
    const [absenceEndDate, setAbsenceEndDate] = useState<string | undefined>("")

    const handleUpdateWeek = () => {
        const data = {
            day: currentWeek[0],
            trainingLocation: activityValue,
        }

        api.post("api/storeNewWeekData", data)

        setIsOpen(false)
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
                                        trainingLocation ??
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
