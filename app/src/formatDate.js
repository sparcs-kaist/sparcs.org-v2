export default function formatDate(dateObj) {
    let month = `${dateObj.getMonth() + 1}`;
    let day = `${dateObj.getDate()}`;

    month = month.length < 2 ? `0${month}` : month;
    day = day.length < 2 ? `0${day}` : day;

    return `${dateObj.getFullYear()}-${month}-${day}`;
}
