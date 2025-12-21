import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/frontend/components/lib/api-path.ts'

export default function App() {
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/api/ready').then(r => {
            if (r.data) {
                navigate('/dashboard')
            } else {
                navigate('/signup')
            }
        })
    }, [])

    return <></>
}
