import React, {useCallback, useEffect, useRef} from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {fetchHolidays} from "../../store/reducers/holidaysReducer";
import {fetchCountriesCode } from "../../store/reducers/countriesCodeReducer";
import {updateEvent} from "../../store/reducers/eventsReducer";
import {addCurrentDate} from "../../store/reducers/currentDateReducer";
import {Button } from "../../styles";
import {DayItem, EventItem} from "./components";

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarWeekCell = styled.div`
  text-align: center;
`;

const HolidayName = styled.span`
  color: green;
  margin-left: 3px;
`;

const NavigationPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  button {
    background-color: #f0f0f0;
    border: none;
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background-color: #ccc;
    }
  }
`;

const EventContainer = styled.div`
  height: 70px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
`

export const CalendarContainer = () => {
    const dispatch = useAppDispatch();
    const {holidays} = useAppSelector((state) => state.holidays);
    const {countryCode} = useAppSelector((state) => state.countriesCode);
    const {events} = useAppSelector((state) => state.events);
    const {currentDate} = useAppSelector((state) => state.currentDate)

    const draggedItem = useRef(null);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, item: string) => {
        // @ts-ignore
        draggedItem.current = item;
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const addElementsToDateArray = (startDate: Date, arrayDate: string[]) => {
        const newArray: string[] = [];

        let currentDate = new Date(startDate);

        for (let i = 0; i < arrayDate.length; i++) {
            newArray.push(currentDate.toISOString().substr(0, 10));

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return newArray;
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>, dayId: any) => {
        event.preventDefault();
        const data = await structuredClone(draggedItem.current);
        if (data) {

            if (data.startDate === data.endDate) {
                data.startDate = dayId;
                data.endDate = dayId;
                data.arrayDate[0] = dayId;
                data.arrayDate[1] = dayId;
            } else {
                data.startDate = dayId;
                data.arrayDate = addElementsToDateArray(dayId, data.arrayDate)
                data.endDate = data.arrayDate.at(-1);
            }

            // updateEvent
            // @ts-ignore
            dispatch(updateEvent(data))
            // setEvents((prevItems) => prevItems.map((item) => (item.id === data.id ? data : item)))
            draggedItem.current = null
        }
    };

    const weekdays = moment.weekdaysShort();

    const renderDaysOfWeek = () => {
        return weekdays.map((day) => <CalendarWeekCell key={day}>{day}</CalendarWeekCell>);
    }

    const renderCalendarDays = useCallback(() => {

        const startDate = currentDate.clone().startOf('month').startOf('week');
        const days = [];

        for (let i = 0; i < 42; i++) {
            const day = startDate.clone().add(i, 'days');
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = day.isSame(moment(), 'day');
            // @ts-ignore
            const isHoliday = holidays.some((holiday) => moment(holiday.date, 'YYYY-MM-DD').isSame(day, 'day'));
            // @ts-ignore
            const holidayName = isHoliday ? holidays.find((holiday) => moment(holiday.date, 'YYYY-MM-DD').isSame(day, 'day')).name : null;
            // @ts-ignore
            const eventsArray = events?.filter((event) => {
                // @ts-ignore
                if (Array.isArray(event.arrayDate)) {
                    // @ts-ignore
                    return event.arrayDate.find((itemDate) => moment(itemDate, 'YYYY-MM-DD').isSame(day, 'day'))
                }
            });

            days.push(
                <DayItem key={day.format('YYYY-MM-DD')} isCurrentMonth={isCurrentMonth} isToday={isToday}
                         onDragOver={(event) => handleDragOver(event, day.format('YYYY-MM-DD'))}
                         onDrop={(event) => handleDrop(event, day.format('YYYY-MM-DD'))}>
                    {day.format('D')}
                    {isHoliday ? <HolidayName>{holidayName}</HolidayName> : null}
                    {eventsArray.length ?
                        <EventContainer>
                            {eventsArray.map((item) =>  <EventItem item={item} day={day} handleDragStart={handleDragStart}/>)}
                        </EventContainer>
                        : null
                    }
                </DayItem>
            );
        }

        return days;
    }, [currentDate, holidays, events]);

    const goToPreviousMonth = () => {
        dispatch(addCurrentDate({currentDate: currentDate.clone().subtract(1, 'month')}))
    };

    const goToNextMonth = () => {
        dispatch(addCurrentDate({currentDate: currentDate.clone().add(1, 'month')}));
    };

    const goToToday = () => {
        dispatch(addCurrentDate({currentDate: moment()}));
    };

    useEffect(() => {
        if (countryCode) {
            dispatch(fetchHolidays({countryCode, year: currentDate.format('YYYY')}))
        }

    }, [countryCode, currentDate.format('YYYY')]);

    useEffect(() => {
        dispatch(fetchCountriesCode())
    }, []);


    return (
        <div>
            <NavigationPanel>
                <Button onClick={goToToday}>Today</Button>
                <Button onClick={goToPreviousMonth}>Previous month</Button>
                <Button onClick={goToNextMonth}>Next month</Button>
                <div>{currentDate.format('MMMM YYYY')}</div>
            </NavigationPanel>
            <CalendarGrid>
                {renderDaysOfWeek()}
                {renderCalendarDays()}
            </CalendarGrid>

        </div>
    );
};
