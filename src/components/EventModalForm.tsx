import Modal from "react-modal";
import {Button, customModalStyles, Form} from "../styles";
import React, {FC, useEffect, useState} from "react";
import styled from "styled-components";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {EventI, Label} from "../services/types";
import {checkDifferenceDays} from "../services/utils";
import {addEvent, removeEvent, updateEvent} from "../store/reducers/eventsReducer";

interface Props {
    modalIsOpen: boolean;
    closeModal: () => void;
    mode?: 'create' | 'edit';
    indexEvent?: number
}

const LabelForm = styled.div`
  display: flex;
  flex-direction: column;
`

export const EventModalForm: FC<Props> = ({
                                              modalIsOpen = false,
                                              closeModal,
                                              mode = 'create',
                                              indexEvent= 0
                                          }) => {
    const dispatch = useAppDispatch();
    const {labels} = useAppSelector((state) => state.labels);
    const {events} = useAppSelector((state) => state.events);
    const conditionMode = mode === 'create';
    const initialSelectedItem: EventI | null = conditionMode ? null : events.filter((item) => item.id === indexEvent)[0];
    // @ts-ignore
    const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);


    useEffect(() => {
        if(!conditionMode ) {
            // @ts-ignore
            setSelectedLabels(initialSelectedItem?.label)
        }
    }, [conditionMode])


    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLabelText = event.target.value;
        const selectedLabel = labels.find((label) => label.text === selectedLabelText);
        const checkDataInArray = !!selectedLabels?.find((label) => label.text === selectedLabelText);

        if (selectedLabel && !checkDataInArray) {
            setSelectedLabels([...selectedLabels, selectedLabel]);
        }
    };

    const handleDeleteSelectedLabels = (id: number) => {
        const updatedLabels = selectedLabels.filter((label, index) => index !== id);
        setSelectedLabels(updatedLabels);
    }

    const handleFormSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        const label = selectedLabels;
        const description = event.target.description.value;
        const startDate = event.target.startDate.value;
        const startTime = event.target.startTime.value;
        const endDate = event.target.endDate.value;
        const endTime = event.target.endTime.value;
        const arrayDate = checkDifferenceDays(startDate, endDate);
        const id = conditionMode ? events.length + 1 : initialSelectedItem?.id;
        const newEvent = {id, label, description, startDate, startTime, endDate, endTime, arrayDate}

        if(conditionMode) {
            // @ts-ignore
            dispatch(addEvent(newEvent));
        } else {
            // @ts-ignore
            dispatch(updateEvent(newEvent));
        }

        event.target.reset();
        setSelectedLabels([]);
        closeModal();
    };

    const onRemoveEvent = (id: number | null) => {
        if(id) {
            dispatch(removeEvent({id}))
            setSelectedLabels([]);
            closeModal();
        }
    }

    return (
        <Modal
            appElement={document.getElementById('root') as HTMLElement}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customModalStyles}
        >
            <Form onSubmit={handleFormSubmit}>
                <h2>{conditionMode ? 'Create Event' : 'Edit Event'}</h2>
                <LabelForm>
                    <label>
                        Label:

                        <select onChange={handleSelectChange}>
                            <option value="">Choose label</option>
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
                                <Button type="button" onClick={() => handleDeleteSelectedLabels(index)}>remove</Button>
                            </div>))
                    }

                </LabelForm>
                <label>
                    Description:
                    <input name='description' defaultValue={conditionMode ? undefined : initialSelectedItem?.description ?? ''} type="text"/>
                </label>
                <label>
                    Start Date:
                    <input name='startDate' defaultValue={conditionMode ? undefined : initialSelectedItem?.startDate ?? ''} type="date"/>
                </label>
                <label>
                    End Date:
                    <input name='endDate' defaultValue={conditionMode ? undefined : initialSelectedItem?.endDate ?? ''} type="date"/>
                </label>
                <label>
                    Start Time:
                    <input name='startTime' defaultValue={conditionMode ? undefined : initialSelectedItem?.startTime ?? ''} type="time"/>
                </label>

                <label>
                    End Time:
                    <input name='endTime' defaultValue={conditionMode ? undefined : initialSelectedItem?.endTime ?? ''} type="time"/>
                </label>
                <Button type="submit">{conditionMode ? 'Add Event' : 'Edit Event'}</Button>
                {
                    !conditionMode && <Button type="button" onClick={() => onRemoveEvent(initialSelectedItem?.id ?? null)}>Remove Event</Button>
                }
            </Form>
        </Modal>
    )
}
