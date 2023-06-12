import React, {useState} from "react";
import {Label} from "../../../../services/types";
import {deleteLabel, updateLabel} from "../../../../store/reducers/labelsReducer";
import {Button} from "../../../../styles";
import {useAppDispatch} from "../../../../store/hooks";
import styled from "styled-components";

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

export const LabelComponent: React.FC<{ label: Label, id: number }> = ({label, id}) => {
    const dispatch = useAppDispatch();
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
