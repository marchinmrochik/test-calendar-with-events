import {Button} from "../../../../styles";
import React, {useState} from "react";
import {EventModalForm} from "../../../../components/EventModalForm";


export const Event = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true)
    };

    const closeModal = () => {
        setModalIsOpen(false)
    };


    return (
        <>
            <Button onClick={openModal}>Add Event</Button>
            <EventModalForm closeModal={closeModal} modalIsOpen={modalIsOpen} />
        </>
    )
}
