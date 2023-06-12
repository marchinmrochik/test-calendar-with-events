import {Button} from "../../../../styles";
import React, {useState} from "react";
import Modal from 'react-modal';
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {customModalStyles, Form} from "../../../../styles";
import {addLabel} from "../../../../store/reducers/labelsReducer";
import styled from "styled-components";
import {LabelComponent} from "./LabelComponent";

const LabelsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;


export const Labels = () => {
    const dispatch = useAppDispatch();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { labels } = useAppSelector((state) => state.labels);

    const openModal = () => {
        setModalIsOpen(true)
    };

    const closeModal = () => {
        setModalIsOpen(false)
    };

    const handleFormLabelSubmit = (event: any) => {
        event.preventDefault();

        const text = event.target.text.value;
        const color = event.target.color.value;

        event.target.reset();
        dispatch(addLabel({ text, color}));
    }

    return (
        <>
            <Button onClick={openModal}>Labels</Button>
            <Modal
                appElement={document.getElementById('root') as HTMLElement}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customModalStyles}
            >
                <Form onSubmit={handleFormLabelSubmit}>
                    <h2>Create Labels</h2>
                    <div>
                        <input
                            type="text"
                            name='text'
                        />
                        <input
                            type="color"
                            name="color"
                        />
                        <Button type='submit'>Add Label</Button>
                    </div>
                    <LabelsContainer>
                        {labels.map((label, index) => (
                            <LabelComponent key={index} id={index} label={label} />
                        ))}
                    </LabelsContainer>
                </Form>
            </Modal>
        </>
    )
}
