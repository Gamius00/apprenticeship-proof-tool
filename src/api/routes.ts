import express from 'express'
import cors from 'cors'
import { isJsonReady, setup } from '../server/storage-data.ts'

const app = express()

interface Data {
    year: number
    name: string
}

// Convert the data to json
app.use(express.json())

// Allows the browser to access the origins on the api
app.use(cors())

/* POST request to localhost:3000/api with the frontend data
 * we want to write in the backend **/
app.post('/api/createSetup', (req, res) => {
    const body = req.body as Data
    setup(body)
    res.send({ message: 'Successfully sended' })
})

// Checks if already JSON data is storaged
app.get('/api/ready', (req, res) => {
    const ready = isJsonReady()
    res.send(ready)
})

// The active listen backend port
app.listen(3000, () => {
    console.log('Server is now running')
})
