import styled from 'styled-components';

const Input = styled.input`
    width: ${(props) => props.size === 's' && '12rem'};
    width: ${(props) => props.size === 'm' && '22rem'};
    width: ${(props) => props.size === 'l' && '90%'};
    
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
        <Input type={props.type} placeholder={props.placeholder} size={props.size} onChange={props.onChange}
        required={props.required} onInvalid={props.onInvalid} onInput={props.onInput} pattern={props.pattern} title={props.title}
        maxLength={props.maxLength} disabled={props.disabled}
        />
    );
};

export default Input01;