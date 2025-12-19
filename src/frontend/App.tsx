import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function App() {
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:3000/api/ready').then(r => {
            if (r.data) {
                navigate('/dashboard')
            } else {
                navigate('/signup')
            }
        })
    })

    return <></>
}
