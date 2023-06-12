import styled, {css} from "styled-components";

export const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


export const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
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

export const Button = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }

  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}
`;


export const Select = styled.select`
  background-color: #f0f0f0;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  margin-right: 8px;

  &:hover {
    background-color: #ccc;
  }

  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}
`;
