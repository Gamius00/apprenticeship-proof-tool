import { Input } from '@/frontend/components/ui/shadcn/input.tsx'
import { Button } from '@/frontend/components/ui/shadcn/button.tsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '@/shared-utils/api-path.ts'
import { DateInput } from '@/frontend/components/ui/date-picker.tsx'
import { DATE_FORMATS, formatDate } from '@/shared-utils/date.ts'

interface Data {
    apprenticeShipBegin: string | undefined
    name: string
}

export default function Signup() {
    const [apprenticeShipBegin, setApprenticeShipBegin] = useState<string | undefined>(
        undefined,
    )
    // Name of user
    const [name, setName] = useState<string>('')
    const navigate = useNavigate()

    /* Api call to storage the data in the JSON File **/
    const handleFirstLogin = async () => {
        const data: Data = {
            apprenticeShipBegin: formatDate({
                date: apprenticeShipBegin ? new Date(apprenticeShipBegin) : undefined,
                formatDateOption: DATE_FORMATS.DAY_MONTH_YEAR,
            }),
            name: name,
        }
        const response = await api.post('/api/createSetup', data)
        // If the data is created successfully navigate to the dashboard
        if (response.status === 200) {
            navigate('/dashboard')
        } else {
            console.error('Please try again')
        }
    }

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    return (
        <>
            <div className="bg-background h-screen flex justify-center items-center flex-col text-text">
                <div className="flex flex-col items-center">
                    <p className="mb-5 text-lg">Welcome to the</p>
                    <p className="text-2xl italic">Communardo Apprenticeship Tracker</p>
                </div>

                <div className="mt-5">
                    <p className="pb-2">Name</p>
                    <Input
                        value={name}
                        onChange={e => {
                            handleChangeName(e)
                        }}
                        className="w-96 bg-text text-black"
                    />
                </div>

                <div className="mt-5">
                    <div className="w-96">
                        <DateInput
                            setValue={setApprenticeShipBegin}
                            value={apprenticeShipBegin}
                        />
                    </div>
                </div>

                <Button className="mt-10" onClick={handleFirstLogin}>
                    Continue
                </Button>
            </div>
        </>
    )
}
