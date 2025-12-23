import express from 'express'
import cors from 'cors'
import {
    getMetaData,
    isJsonReady,
    setup,
    storesNewEntry,
} from '../server/storage-data.ts'

const app = express()
const port = 3000

// Convert the data to json
app.use(express.json())

// Allows the browser to access the origins on the api
app.use(cors())

/* POST request to localhost:3000/api with the frontend data
 * we want to write in the backend **/
app.post('/api/createSetup', (req, res) => {
    setup(req.body)
    res.send({ message: 'Successfully sended' })
})

// Checks if already JSON data is storaged
app.get('/api/ready', (req, res) => {
    const ready = isJsonReady()
    res.send(ready)
})

// Get the data from the backend
app.get('/api/getMetaData', (req, res) => {
    const data = getMetaData()
    res.send(data)
})

app.post('/api/storeNewEntry', (req, res) => {
    const data = storesNewEntry(req.body)
    console.log(data)
    res.send(data)
})

// The active listen backend port
app.listen(port, () => {
    console.log('Server is now running on port: ' + port)
})
