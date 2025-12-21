// Returns an array with the work days of the current week
export const getWeek = (difference: number) => {
    const array = []

    const today = new Date()
    const day = today.getDay()

    // Calculates the difference between today and the last monday
    const diff = day === 0 ? -6 : 1 - day

    //
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)

    /* Calculate all work days of the current week
     * The calculation starts on Monday and continues through Friday. **/
    for (let i = 0; i < 5; i++) {
        const newDay = new Date().setDate(monday.getDate() + i + difference)
        array.push(new Date(newDay))
    }

    return array
}

// Calculate the Weekday
export const getWeekday = (day: number) => {
    const weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    return weekday[day - 1]
}
