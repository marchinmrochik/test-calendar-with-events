import React, {FC, ReactNode, useState} from 'react';
import styled from "styled-components";
import {EventModalForm} from "../../../../components/EventModalForm";

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

type DayItemProps = {
    key: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
    children: ReactNode;
};

export const DayItem:FC<DayItemProps> = ({
                     key,
                     isCurrentMonth,
                     isToday,
                     onDragOver,
                     onDrop,
                     children,
                 }) => {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = (event: any) => {
        if(event.target.nodeName === 'DIV' && !event.target.className.includes('ReactModal__Overlay')) {
            setModalIsOpen(true)
        }
    };

    const closeModal = () => {
        setModalIsOpen(false)
    };
    return (
        <>
            <DayCell
                key={key}
                isToday={isToday}
                className={isCurrentMonth ? 'current-month' : 'other-month'}
                isCurrentMonth={isCurrentMonth}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={openModal}
            >
                {children}
            </DayCell>
            <EventModalForm closeModal={closeModal} modalIsOpen={modalIsOpen} />
        </>

    );
};

