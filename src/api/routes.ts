import express from "express"
import cors from "cors"
import {
    getEntry,
    getMetaData,
    isJsonReady,
    deleteEntry,
    setup,
    resolveWeekData,
    storesNewWeekData,
    removeAbsence,
} from "../server/storage-data.ts"
import { port } from "../shared-utils/api-path.ts"
import { createPdf } from "../server/createPdf.ts"

const app = express()

// Convert the data to json
app.use(express.json())

// Allows the browser to access the origins on the api
app.use(cors())

/* POST request to localhost:3000/api with the frontend data
 * we want to write in the backend **/
app.post("/api/createSetup", (req, res) => {
    setup(req.body)
    res.send({ message: "Successfully sended" })
})

// Checks if already JSON data is storaged
app.get("/api/ready", (req, res) => {
    const ready = isJsonReady()
    res.send(ready)
})

app.post("/api/removeAbsence", req => {
    removeAbsence(req.body)
})

// Get the data from the backend
app.get("/api/getMetaData", (req, res) => {
    const data = getMetaData()
    res.send(data)
})

// Stores a new entry in the json file
app.post("/api/storeNewWeekData", (req, res) => {
    const data = storesNewWeekData(req.body)
    res.send(data)
})

app.post("/api/getWeekData", (req, res) => {
    const data = resolveWeekData(req.body)
    res.send(data)
})

app.post("/api/getEntry", (req, res) => {
    const data = getEntry(req.body)
    res.send(data)
})

app.post("/api/deleteEntry", req => {
    deleteEntry(req.body)
})

app.post("/pdf", async (req, res) => {
    const response = await createPdf(req.body)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'inline; filename="ihk-template.pdf"')

    res.send(Buffer.from(response))
})

// The active listen backend port
app.listen(port, () => {
    console.log("Server is now running on port: " + port)
})
