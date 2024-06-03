export const bstDateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() + 6);

    const formattedDate = date.toISOString();

    return formattedDate
}
