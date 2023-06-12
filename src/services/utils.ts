import moment from "moment";

export const checkDifferenceDays = (startDateProps: string, endDateProps: string) => {
    const startDate = moment(startDateProps);
    const endDate = moment(endDateProps);
    const days = [];

    if (startDate.isSame(endDate, 'day')) {
        days.push(startDate.format('YYYY-MM-DD'));
    }

    const currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate, 'day')) {
        days.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, 'day');
    }

    return days
}

export const conditionLongDate = (item: any, day: any) => {
    const checkLongDate = item.startDate !== item.endDate;

    if (checkLongDate) {
        return !moment(item.endDate, 'YYYY-MM-DD').isSame(day, 'day')
    }

    return checkLongDate
}
