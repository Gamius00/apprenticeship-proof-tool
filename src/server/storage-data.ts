import fs from 'fs'
import path from 'path'

const filePath = path.join('src/server/data/data.json')

// Get the data from the JSON File
export function getData() {
    return JSON.parse(fs.readFileSync('src/server/data/data.json', 'utf-8'))
}

// Checks if the JSON file already exists
export function isJsonReady() {
    return fs.existsSync(filePath)
}

// Create the JSON setup
export function setup(data: { name: string; year: number }) {
    fs.writeFileSync('src/server/data/data.json', JSON.stringify(data))
}
