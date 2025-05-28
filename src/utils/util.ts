export function fillDatesWithFlags(dates: string[], limit: number): number[] {
    if (!dates || dates.length === 0) return Array(limit).fill(0);

    const today = new Date();
    const dateSet = new Set(dates.map(d => new Date(d).toISOString().slice(0, 10)));

    const result: number[] = [];

    for (let i = 0; i < limit; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - i); // go backwards
        const isoDate = currentDate.toISOString().slice(0, 10);

        result.push(dateSet.has(isoDate) ? 1 : 0);
    }

    return result;
}
