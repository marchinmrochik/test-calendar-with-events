import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import styled from 'styled-components';
import axios from "axios";

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const CalendarWeekCell = styled.div`
  text-align: center;
`;

const HolidayName = styled.span`
  color: green;
  margin-left: 3px;
`;

interface DayCellProps {
    isCurrentMonth: boolean;
    isToday: boolean;
}

const DayCell = styled.div<DayCellProps>`
  background-color: ${(props) =>
          props.isCurrentMonth ? (props.isToday ? 'orange' : '#f0f0f0') : '#ccc'};
  padding: 8px;
  height: 100px;
  text-align: left;
  cursor: pointer;
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

const NavigationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const NavigationButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  margin-right: 8px;

  &:hover {
    background-color: #ccc;
  }
`;

const SearchInput = styled.input`
  padding: 8px;
  margin-right: 8px;
`;

const Modal = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 30px 30px;
  background: white;

  button {
    background-color: #f0f0f0;
    border: none;
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background-color: #ccc;
    }
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  input {
    padding: 5px;
    width: 200px;
    box-sizing: border-box;
    margin-left: 15px;
  }
`;

const HeaderModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
  }

  button {
    padding: 5px 10px;
    font-size: 20px;
  }
`

const EventContainer = styled.div`
  height: 70px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
`

interface EventLabelProps {
    label: string;
}

const EventLabel = styled.div<EventLabelProps>`
  background-color: ${(props) =>
          props.label ? props.label : ''};
  border-radius: 15px;
  padding: 2px 10px;
  margin-bottom: 5px;
`

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [holidays, setHolidays] = useState([]);
    const [countriesCode, setCountriesCode] = useState([]);
    const [countryCode, setCountryCode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);

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
            const eventsArray = events?.filter((event) => moment(event.date, 'YYYY-MM-DD').isSame(day, 'day'));


            days.push(
                <DayCell key={day.format('DD-MM-YYYY')} isCurrentMonth={isCurrentMonth} isToday={isToday}
                         onClick={handleAddEvent}>
                    {day.format('D')}
                    {isHoliday ? <HolidayName>{holidayName}</HolidayName> : null}
                    {eventsArray.length ?
                        <EventContainer>
                            {eventsArray.map((item) => {
                                // @ts-ignore
                                return <EventLabel label={item.label}>{item?.description}</EventLabel>
                            })}
                        </EventContainer>
                        : null
                    }
                </DayCell>
            );
        }

        return days;
    }, [currentDate, holidays, events]);

    const goToPreviousMonth = () => {
        setCurrentDate(currentDate.clone().subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentDate(currentDate.clone().add(1, 'month'));
    };

    const goToToday = () => {
        setCurrentDate(moment());
    };

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await axios.get(`https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`);
                setHolidays(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (countryCode) {
            fetchHolidays();
        }

    }, [countryCode]);

    useEffect(() => {
        const getCountries = async () => {
            try {
                const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
                const countries = response.data;
                const {data} = await axios.get('http://ip-api.com/json');
                setCountriesCode(countries);

                if (countries.some((item: { countryCode: any; }) => item.countryCode === data.countryCode)) {
                    setCountryCode(data.countryCode)
                } else {
                    setCountryCode(countries[0])
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        getCountries();
    }, []);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryCode(event.target.value);
    };

    const handleAddEvent = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (event: any) => {
        event.preventDefault();

        const label = event.target.label.value;
        const description = event.target.description.value;
        const date = event.target.date.value;
        const time = event.target.time.value;

        const newEvent = {label, description, date, time}

        // @ts-ignore
        setEvents(prevEvents => [...prevEvents, newEvent]);

        event.target.reset();
        handleModalClose();
    };

    return (
        <div>
            <h1>Calendar</h1>
            <select value={countryCode} onChange={handleCountryChange}>
                {countriesCode.map((item: { countryCode: string; name: string }) => <option
                    value={item.countryCode}> {item.name} </option>)
                }
            </select>
            <NavigationBar>
                <div>
                    <NavigationButton onClick={goToToday}>Today</NavigationButton>
                    <NavigationButton onClick={handleAddEvent}>Add Event</NavigationButton>
                    <NavigationButton>Filters</NavigationButton>
                    <NavigationButton>Export</NavigationButton>
                    <NavigationButton>Download</NavigationButton>
                </div>
                <div>
                    <SearchInput type="text" placeholder="Search"/>
                </div>
            </NavigationBar>
            <NavigationPanel>
                <button onClick={goToPreviousMonth}>Previous month</button>
                <div>{currentDate.format('MMMM YYYY')}</div>
                <button onClick={goToNextMonth}>Next month</button>
            </NavigationPanel>
            <CalendarGrid>
                {renderDaysOfWeek()}
                {renderCalendarDays()}
            </CalendarGrid>

            {showModal && (
                <Modal>
                    <Form onSubmit={handleFormSubmit}>
                        <HeaderModal>
                            <h2>Create Event </h2>
                            <button onClick={handleModalClose}>x</button>
                        </HeaderModal>
                        <label>
                            Label:
                            <input name='label' type="color"/>
                        </label>
                        <label>
                            Description:
                            <input name='description' type="text"/>
                        </label>
                        <label>
                            Date:
                            <input name='date' type="date"/>
                        </label>
                        <label>
                            Time:
                            <input name='time' type="time"/>
                        </label>
                        <button type="submit">Add Event</button>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default Calendar;
