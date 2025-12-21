export const getWeek = (difference: number) => {
    const array = []

    const today = new Date()
    const day = today.getDay()

    const diff = day === 0 ? -6 : 1 - day

    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)

    for (let i = 0; i < 5; i++) {
        const newDay = new Date().setDate(monday.getDate() + i + difference)
        array.push(new Date(newDay))
    }

    return array
}
