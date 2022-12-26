import styled from 'styled-components';

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;    
    width: 9rem;
    border-radius: 1.4rem;
    border: 2px solid #D1D9DE;
    padding: 10px;
    background-color: #ffffff;
    font-family: "SUIT-Medium";
    font-size: 1rem;

    &:hover {
        border: 2px solid #4461AA;
    }
`

const Button03 = (props) => {
    return (
        <Button type={props.type} size={props.size} onClick={props.onClick}> 
            {props.text}
        </Button>
    );
};

export default Button03;