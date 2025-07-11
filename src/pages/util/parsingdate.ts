export function formatDate(val: string | Date): string {
    const date = new Date(val);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'long' }); // e.g. August
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hour}:${minute}`;
}
