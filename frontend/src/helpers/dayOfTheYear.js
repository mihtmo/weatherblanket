function getDayOfTheYear(date) {
    const convertedDate = new Date(date)
    return ((Date.UTC(convertedDate.getFullYear(), convertedDate.getMonth(), convertedDate.getDate()) - Date.UTC(convertedDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000);
}

export default getDayOfTheYear