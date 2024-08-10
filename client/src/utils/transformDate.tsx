export const transformShortDateString = (date: Date): string => {
    const isoString = date.toISOString(); // Get ISO string format
    const [year, month, day] = isoString.split('T')[0].split('-'); // Extract date parts
    return `${day}/${month}/${year}`; // Return in desired format
};

export const transformDateAndDayString = (date: Date): string => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 3);
    const formattedDate = transformShortDateString(date);

    return `${day} - ${formattedDate}`;
};


export const transformFullDateString = (date: Date): string => {
    const stringDate = date.toISOString().split('T')[0];
    const [year, month, day] = stringDate.split('-');
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return `${day}/${month}/${year}, ${dayOfWeek} ${time}`;
};

export const combineDateTime = (dayDate: Date, slotStart: string) => {
    const date = new Date(dayDate);
    const dateString = date.toISOString().split('T')[0];

    const combinedDateTimeString = `${dateString}T${slotStart}:00`;
    return new Date(combinedDateTimeString);

  }