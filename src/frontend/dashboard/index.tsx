import { useState } from 'react'
import { api } from '@/frontend/components/lib/api-path.ts'

interface Data {
    name: string
    year: number
}

export default function Dashboard() {
    const [data, setData] = useState<Data | null>(null)

    api.get('/api/getData').then(r => setData(r.data))

    return (
        <div>
            Dashboard{' '}
            {data ? (
                <p>
                    {data.year} {data.name}
                </p>
            ) : null}
        </div>
    )
}
