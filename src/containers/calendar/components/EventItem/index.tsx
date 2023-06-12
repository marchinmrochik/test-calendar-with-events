import {EventModalForm} from "../../../../components/EventModalForm";
import React, {FC, useState} from "react";
import  { conditionLongDate } from "../../../../services/utils";
import styled from "styled-components";
import {EventI} from "../../../../services/types";


interface EventLabelProps {
    radiusBorderRight: boolean
}

const EventLabel = styled.div<EventLabelProps>`
  background-color: olivedrab;
  border-bottom-right-radius: ${props => props.radiusBorderRight ? '15px' : 0};
  border-top-right-radius: ${props => props.radiusBorderRight ? '15px' : 0};
  width: ${props => props.radiusBorderRight ? 'calc(100% - 8px)' : '100%'};
  padding: 2px 10px;
  margin-bottom: 5px;
  box-sizing: border-box;
`

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
    props.color};

  &:last-child {
    margin-right: 0;
  }
`

const Description = styled.div`
  width: 100%;
`

interface Props {
    item: EventI;
    day: any;
    handleDragStart: (event: React.DragEvent<HTMLDivElement>, item: any) => void
}

export const EventItem:FC<Props> = ({ item,day, handleDragStart }) => {
    const [modalShow, setModalShow] = useState(false);

    const openModal = () => {
        if (!modalShow) {
            setModalShow(true);
        }
    };

    const closeModal = ()  => {
        return setModalShow(false)
    };

    return (
        <EventLabel  onClick={openModal} radiusBorderRight={!conditionLongDate(item, day)} draggable onDragStart={(event) => handleDragStart(event, item)}> {item.label?.map((item) =>
            <SpanLabel key={item.text} color={item.color}/>)}
            <Description>{item?.description}</Description>
            <EventModalForm closeModal={closeModal} modalIsOpen={modalShow} mode={'edit'} indexEvent={item.id} />
        </EventLabel>
    )
}
