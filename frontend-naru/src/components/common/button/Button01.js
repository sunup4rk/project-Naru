import styled from 'styled-components';

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;

    width: ${(props) => props.size === 's' && '8%'};
    width: ${(props) => props.size === 'm' && '12%'};
    
    min-width: 6rem;
    height: 2.8rem;
    border-radius: 2rem;
    border: 2px solid #4461AA;
    padding: 20px;
    background-color: #4461AA;
    font-family: "SUIT-Medium";
    color: #ffffff;
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