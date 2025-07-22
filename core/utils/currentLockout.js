function getPreviousWednesdayAt1AM(inputTimestamp) {
    const date = new Date(inputTimestamp)

    // Set to 1:00 AM on the current day
    date.setHours(1, 0, 0, 0)

    // If it's not Wednesday (3), adjust the date backward until it is
    while (date.getDay() !== 3) {
        date.setDate(date.getDate() - 1)
    }

    // This ensures that we only adjust the time if it's past 1 AM on Wednesday
    if (date.getTime() > inputTimestamp) {
        date.setDate(date.getDate() - 7) // Go back one more week
    }

    return date.getTime()
}
export default getPreviousWednesdayAt1AM
