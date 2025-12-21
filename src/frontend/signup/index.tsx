import { Input } from '@/frontend/components/ui/shadcn/input.tsx'
import { Button } from '@/frontend/components/ui/shadcn/button.tsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '@/frontend/components/lib/api-path.ts'

interface Data {
    year: number | null
    name: string
}

export default function Signup() {
    // Storage the apprenticeship year (1, 2, 3)
    const [apprenticeShipYear, setApprenticeShipYear] = useState<number | null>(null)
    // Name of user
    const [name, setName] = useState<string>('')
    const navigate = useNavigate()

    /* Api call to storage the data in the JSON File **/
    const handleFirstLogin = async () => {
        const data: Data = {
            year: apprenticeShipYear,
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

    const handleChangeApprenticeShipYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApprenticeShipYear(Number(e.target.value))
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
                    <p className="pb-2">Apprenticeship year (1, 2, 3)</p>
                    <Input
                        value={apprenticeShipYear || ''}
                        type="number"
                        min={1}
                        max={3}
                        onChange={e => {
                            handleChangeApprenticeShipYear(e)
                        }}
                        className="w-96 bg-text text-black"
                    />
                </div>

                <Button className="mt-10" onClick={handleFirstLogin}>
                    Continue
                </Button>
            </div>
        </>
    )
}
