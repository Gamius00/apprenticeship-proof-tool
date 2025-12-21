import { useEffect, useState } from 'react'
import { BsViewList } from 'react-icons/bs'
import { BiExport } from 'react-icons/bi'
import { FaRegEdit } from 'react-icons/fa'
import { FiPlusCircle } from 'react-icons/fi'
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
    const [data, setData] = useState<Data | null>(null)
    const [diffCount, setDiffCount] = useState(0)
    const navigate = useNavigate()
    const [weekObject, setWeekObject] = useState<WeekObject | null>(null)

    useEffect(() => {
        // Ensures that the user stays on the correct page
        api.get('/api/ready').then(r => {
            if (!r.data) navigate('/signup')
        })

        api.get('/api/getData').then(r => setData(r.data))
    }, [])

    return (
        <div className="bg-background h-screen flex flex-col gap-40 text-text pt-3">
            <div className="flex justify-around">
                <div className="flex gap-10">
                    <div className="flex flex-col items-center">
                        <BsViewList className="h-6 w-6" />
                        <p className="text-xs">View</p>
                    </div>
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
                    <div className="flex flex-col items-center">
                        <FiPlusCircle className="h-6 w-6" />
                        <p className="text-xs">New Entry</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-around">
                <MdOutlineArrowDropDownCircle
                    onClick={() => {
                        setDiffCount(diffCount - 7)
                    }}
                    className="rotate-90 mr-24 h-8 w-8"
                />
                <div className="flex-col items-center flex">
                    <p className="font-medium">Communardo Software</p>
                    <p className="text-lg mt-1 font-medium">
                        {weekObject?.startDate.getDate()} -{weekObject?.endDate.getDate()}
                    </p>
                </div>
                <MdOutlineArrowDropDownCircle
                    onClick={() => {
                        setDiffCount(diffCount + 7)
                    }}
                    className="ml-24 -rotate-90 h-8 w-8"
                />
            </div>
            <WeekView difference={diffCount} setWeekObject={setWeekObject} />
        </div>
    )
}
