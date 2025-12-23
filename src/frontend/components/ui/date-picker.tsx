'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/frontend/components/ui/shadcn/button'
import { Calendar } from '@/frontend/components/ui/shadcn/calendar'
import { Input } from '@/frontend/components/ui/shadcn/input'
import { Label } from '@/frontend/components/ui/shadcn/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/frontend/components/ui/shadcn/popover'
import { DATE_FORMATS, formatDate } from '@/shared-utils/date.ts'

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

interface DatePickerProps {
    value: string | undefined
    setValue: (arg: string | undefined) => void
}

export function DateInput({ value, setValue }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(new Date('2025-06-01'))
    const [month, setMonth] = React.useState<Date | undefined>(date)

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                Apprenticeship begin Date
            </Label>
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={value}
                    placeholder={'11. Juni 2025'}
                    className="bg-text text-black pr-10"
                    onChange={e => {
                        const date = new Date(e.target.value)
                        setValue(e.target.value)
                        if (isValidDate(date)) {
                            setDate(date)
                            setMonth(date)
                        }
                    }}
                    onKeyDown={e => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5 text-black" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={date => {
                                setDate(date)
                                setValue(
                                    formatDate({
                                        date: date,
                                        formatDateOption:
                                            DATE_FORMATS.DAY_MONTH_NAME_WEEKDAY,
                                    }),
                                )
                                setOpen(false)
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
