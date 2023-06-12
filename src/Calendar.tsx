import React, {useCallback, useEffect, useRef, useState} from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {useAppDispatch, useAppSelector} from "./store/hooks";
import {fetchHolidays} from "./store/reducers/holidaysReducer";
import {fetchCountriesCode} from "./store/reducers/countriesCodeReducer";
import {addLabel, deleteLabel, updateLabel} from "./store/reducers/labelsReducer";
import {updateEvent, addEvent} from "./store/reducers/eventsReducer";
import {addCurrentDate} from "./store/reducers/currentDateReducer";
import { Button } from "./styles";

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

interface SpanLabelProps {
    color: string
}

const SpanLabel = styled.span<SpanLabelProps>`
  display: inline-block;
  width: 30px;
  height: 20px;
  margin-right: 5px;
  border-radius: 20px;
  background: ${(props) =>
          props.color} ;
  
  &:last-child {
    margin-right: 0;
  }
`

const Description = styled.div`
  width: 100%;
`

interface DayCellProps {
    isCurrentMonth: boolean;
    isToday: boolean;
}

const DayCell = styled.div<DayCellProps>`
  background-color: ${(props) =>
          props.isCurrentMonth ? (props.isToday ? 'orange' : '#f0f0f0') : '#ccc'};
  padding: 8px 0 8px 0;
  height: 100px;
  text-align: left;
  cursor: pointer;
  border: 0.5px solid;
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
   radiusBorderRight: boolean
}

const EventLabel = styled.div<EventLabelProps>`
  background-color: olivedrab;
  border-bottom-right-radius: ${props => props.radiusBorderRight ? '15px' : 0 };
  border-top-right-radius: ${props => props.radiusBorderRight ? '15px' : 0 };
  width: ${props => props.radiusBorderRight ? 'calc(100% - 8px)' : '100%'};
  padding: 2px 10px;
  margin-bottom: 5px;
  box-sizing: border-box;
`

interface Label {
    text: string;
    color: string;
}

const LabelsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelItem = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  margin: 4px;
  background-color: ${(props) => props.color};
`;

const LabelText = styled.div`
  width: calc(100% - 140px);
`

const LabelForm = styled.div`
  display: flex;
  flex-direction: column;
`

const Calendar = () => {
    const dispatch = useAppDispatch();
    const { holidays } = useAppSelector((state) => state.holidays);
    const { countryCode } = useAppSelector((state) => state.countriesCode);
    const { labels } = useAppSelector((state) => state.labels);
    const { events } = useAppSelector((state) => state.events);
    const { currentDate }  =  useAppSelector((state) => state.currentDate)

    const [showModal, setShowModal] = useState(false);
    const [showModalLabel, setShowModalLabel] = useState(false);

    const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);

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
        if(data) {

            if(data.startDate === data.endDate) {
                data.startDate = dayId;
                data.endDate = dayId;
                data.arrayDate[0] = dayId;
                data.arrayDate[1] = dayId;
            }  else {
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

    const LabelComponent: React.FC<{ label: Label, id: number }> = ({ label, id }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editedText, setEditedText] = useState(label.text);
        const [editedColor, setEditedColor] = useState(label.color);

        const handleEdit = () => {
            setIsEditing(true);
        };

        const handleSave = () => {
            dispatch(updateLabel({id, text: editedText, color: editedColor}));
            setIsEditing(false);
        };

        const handleDelete = () => {
            // deleteLabel(id);
            dispatch(deleteLabel({id}))
        };

        return (
            <LabelItem color={label.color}>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editedText}
                            onChange={(event) => setEditedText(event.target.value)}
                        />
                        <input
                            value={editedColor}
                            onChange={(event) => setEditedColor(event.target.value)}
                            type="color"
                            placeholder="Label Color"
                        />
                        <Button type="button" onClick={handleSave}>save</Button>
                    </>
                ) : (
                    <>
                        <LabelText>{label.text}</LabelText>
                        <Button type="button" onClick={handleEdit}>edit</Button>
                        <Button type="button" onClick={handleDelete}>remove</Button>
                    </>
                )}
            </LabelItem>
        );
    };

    const handleFormLabelSubmit = (event: any) => {
        event.preventDefault();

        const text = event.target.text.value;
        const color = event.target.color.value;

        event.target.reset();
        dispatch(addLabel({ text, color}));
    }

    const handleDeleteSelectedLabels = (id: number) => {
        const updatedLabels = selectedLabels.filter((label, index) => index !== id);
        setSelectedLabels(updatedLabels);
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

            const conditionLongDate = (item: any) => {
                const checkLongDate = item.startDate !== item.endDate;

                if(checkLongDate) {
                    return !moment(item.endDate, 'YYYY-MM-DD').isSame(day, 'day')
                }

                return checkLongDate
            }

            days.push(
                <DayCell key={day.format('YYYY-MM-DD')} isCurrentMonth={isCurrentMonth} isToday={isToday}
                         onClick={handleAddEvent} onDragOver={(event) => handleDragOver(event, day.format('YYYY-MM-DD'))}
                         onDrop={(event) => handleDrop(event, day.format('YYYY-MM-DD'))}>
                    {day.format('D')}
                    {isHoliday ? <HolidayName>{holidayName}</HolidayName> : null}
                    {eventsArray.length ?
                        <EventContainer>
                            {eventsArray.map((item) => {
                                console.log(item)
                                // @ts-ignore
                                return <EventLabel radiusBorderRight={!conditionLongDate(item)} draggable onDragStart={(event) => handleDragStart(event, item)}> {item.label?.map((item) => <SpanLabel key={item.text} color={item.color}/>)} <Description>{item?.description}</Description>
                                </EventLabel>
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
        dispatch(addCurrentDate({ currentDate: currentDate.clone().subtract(1, 'month') }))
    };

    const goToNextMonth = () => {
        dispatch(addCurrentDate({ currentDate: currentDate.clone().add(1, 'month') }));
    };

    const goToToday = () => {
        dispatch(addCurrentDate({ currentDate: moment()}));
    };

    useEffect(() => {
        if (countryCode) {
            dispatch(fetchHolidays({countryCode, year: currentDate.format('YYYY')}))
        }

    }, [countryCode, currentDate.format('YYYY')]);

    useEffect(() => {
        dispatch(fetchCountriesCode())
    }, []);


    const handleAddEvent = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setSelectedLabels([]);
        setShowModal(false);
    };

    const checkDifferenceDays = (startDateProps: string, endDateProps: string) => {
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

    const handleFormSubmit = (event: any) => {
        event.preventDefault();

        const label = selectedLabels;
        const description = event.target.description.value;
        const startDate = event.target.startDate.value;
        const startTime = event.target.startTime.value;
        const endDate = event.target.endDate.value;
        const endTime = event.target.endTime.value;
        const arrayDate = checkDifferenceDays(startDate, endDate);
        const id = events.length + 1;
        const newEvent = {id, label, description, startDate, startTime, endDate, endTime, arrayDate}

        // addEvent
        // @ts-ignore
        dispatch(addEvent(newEvent))
        // setEvents(prevEvents => [...prevEvents, newEvent]);

        event.target.reset();
        setSelectedLabels([]);
        handleModalClose();
    };

    const handleAddLabels = () => {
        setShowModalLabel(!showModalLabel)
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLabelText = event.target.value;
        const selectedLabel = labels.find((label) => label.text === selectedLabelText);
        const checkDataInArray = !!selectedLabels.find((label) => label.text === selectedLabelText);
        // @ts-ignore
        if(!checkDataInArray)  setSelectedLabels([...selectedLabels, selectedLabel]);
    };

    return (
        <div>
            <h1>Calendar</h1>


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

            {showModal && (
                <Modal>
                    <Form onSubmit={handleFormSubmit}>
                        <HeaderModal>
                            <h2>Create Event </h2>
                            <button onClick={handleModalClose}>x</button>
                        </HeaderModal>
                        <LabelForm>
                            <label>
                                Label:
                                <select value={selectedLabels.map((label) => label.text)} onChange={handleSelectChange}>
                                    <option value="" >Choose label</option>
                                    {labels.map((label, index) => (
                                        <option key={index} value={label.text} style={{background: label.color}}>
                                            {label.text}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {
                                selectedLabels?.map((label, index) => (
                                <div key={index + label.text}>
                                    Label: {label.text},
                                    Color:<input style={{width: 50}} type="color" value={label.color}/>
                                    <Button type="button" onClick={ () => handleDeleteSelectedLabels(index)}>remove</Button>
                                </div>))
                            }

                        </LabelForm>
                        <label>
                            Description:
                            <input name='description' type="text"/>
                        </label>
                        <label>
                            Start Date:
                            <input name='startDate' type="date"/>
                        </label>
                        <label>
                            End Date:
                            <input name='endDate' type="date"/>
                        </label>
                        <label>
                            Start Time:
                            <input name='startTime' type="time"/>
                        </label>

                        <label>
                            End Time:
                            <input name='endTime' type="time"/>
                        </label>
                        <button type="submit">Add Event</button>
                    </Form>
                </Modal>
            )}

            {showModalLabel && (
                <Modal>
                    <Form onSubmit={handleFormLabelSubmit}>
                        <HeaderModal>
                            <h2>Create Labels</h2>
                            <button onClick={handleAddLabels}>x</button>
                        </HeaderModal>
                        <div>
                            <input
                                type="text"
                                name='text'
                            />
                            <input
                                type="color"
                                name="color"
                            />
                            <Button type='submit' >Add Label</Button>
                        </div>
                        <LabelsContainer>
                            {labels.map((label, index) => (
                                <LabelComponent key={index} id={index} label={label} />
                            ))}
                        </LabelsContainer>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default Calendar;
