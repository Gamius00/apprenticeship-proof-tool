import { useEffect, useState } from 'react'
import { BiExport } from 'react-icons/bi'
import { FaRegEdit } from 'react-icons/fa'
import { api } from '@/frontend/components/lib/api-path.ts'
import { MdOutlineArrowDropDownCircle } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { WeekView } from '@/frontend/components/ui/week.tsx'

interface Data {
    name: string
    year: number
}

interface WeekObject {
    startDate: Date
    endDate: Date
}

export default function Dashboard() {
    /* Gets the metadata (e.g. Name) **/
    const [data, setData] = useState<Data | null>(null)
    /* the offset between the current week and the week shown in the application **/
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()
    // The data for the first and last day of the current week
    const [weekObject, setWeekObject] = useState<WeekObject | null>(null)

    useEffect(() => {
        // Ensures that the user stays on the correct page
        api.get('/api/ready').then(r => {
            if (!r.data) navigate('/signup')
        })

        api.get('/api/getMetaData').then(r => setData(r.data))
    }, [])

    return (
        <div className="bg-background w-screen h-screen flex flex-col gap-40 text-text pt-3">
            <div className="flex justify-around">
                <div className="flex gap-10">
                    <div className="flex flex-col items-center">
                        <BiExport className="h-6 w-6" />
                        <p className="text-xs">Export</p>
                    </div>
                </div>
                <div className="font-medium pt-3">
                    {data ? <p>{data.name}</p> : 'Loading'}
                </div>
                <div className="flex gap-10">
                    <div className="flex flex-col items-center">
                        <FaRegEdit className="h-6 w-6" />
                        <p className="text-xs">Edit Week</p>
                    </div>
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
                    <p className="font-medium">Communardo Software</p>
                    <p className="text-lg mt-1 font-medium">
                        {weekObject &&
                            `${weekObject.startDate.getDate()}.${weekObject.startDate.getMonth() + 1}.${weekObject.startDate.getFullYear()}`}{' '}
                        -{' '}
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
            <WeekView difference={offset} setWeekObject={setWeekObject} />
        </div>
    )
}
