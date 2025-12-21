export const Day = ({ day }: { day: Date }) => {
    const test = new Date(day)

    return (
        <div className="p-1">
            {test.getDate()}.{test.getMonth() + 1}.{test.getFullYear()}
        </div>
    )
}
