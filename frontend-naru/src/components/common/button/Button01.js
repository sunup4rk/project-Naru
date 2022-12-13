import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;

    width: ${(props) => props.size === 's' && '2rem'};
    width: ${(props) => props.size === 'm' && '9rem'};
    
    // min-width: 8rem;
    height: 2.8rem;
    border-radius: 2rem;
    border: 2px solid #4461AA;
    padding: 20px;
    background-color: #fafafa;
    font-family: "SUIT-Medium";
    font-size: 1rem;
    color: #000000;
    box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.2);

    &:hover {
        color: #ffffff;
        background-color: #4461AA;
    }
}
`

const Button01 = (props) => {
    return (
            <Button type={props.type} size={props.size}>
            {props.text}
            </Button>
    );
};

export default Button01;