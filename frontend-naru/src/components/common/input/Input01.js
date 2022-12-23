import styled from 'styled-components';

const Input = styled.input`
    width: ${(props) => props.size === 's' && '12rem'};
    width: ${(props) => props.size === 'm' && '22rem'};
    
    // min-width: 13rem;
    height: 2.8rem;
    border-radius: 30px;
    border: 1px solid #D1D9DE;
    padding: 20px;
    font-family: "SUIT-Medium";
    font-size: 1rem;

    &:focus {
        outline: 1px solid #4461AA;
    }
`

const Input01 = (props) => {
    return (
        <Input type={props.type} placeholder={props.placeholder} size={props.size} disabled={props.disabled}
        defaultValue={props.defaultValue} {...props.register}/>
    );
};

export default Input01;