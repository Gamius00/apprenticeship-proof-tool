import fs from 'fs'
import path from 'path'

const filePath = path.join('src/server/data/data.json')

export function writeJson(data: { name: string; year: number }) {
    console.log(data.year, data.name, 'klappt fabius ;)')
}

export function isJsonReady() {
    return fs.existsSync(filePath)
}

// Create the JSON setup
export function setup(data: { name: string; year: number }) {
    fs.writeFileSync('src/server/data/data.json', JSON.stringify(data))
}
