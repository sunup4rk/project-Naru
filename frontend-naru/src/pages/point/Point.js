import { useEffect, useState } from "react";
import axios from 'axios';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/common/modal/Modal";

const Div =  styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 200px;
    border: 2px solid black;
    margin: 10px;
`

const DivR =  styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 200px;
    border: 2px solid black;
    margin: 10px;
    background-color: #46BEFF;
    color: #ffffff;
`

const DivSR =  styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 200px;
    border: 2px solid black;
    margin: 10px;
    background-color: #FFE13C;
    color: #000000;
`

const DivUR =  styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 200px;
    border: 2px solid black;
    margin: 10px;
    // background-color: #FF9DFF;
    background-color: #73EAA8;
    color: #000000;
`
const Normal =  styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 200px;
    border: 2px solid black;
    margin: 10px;
    background-color: #6E6E6E;
    color: #000000;
    border-radius : 10px;
`

const Point = () => {
    // 100포인트 있어야됨
    const navigate = useNavigate();
    const [ point, setPoint ] = useState();
    const [ value, setValue ] = useState();
    const [ cardValue, setCardValue ] = useState();
    const { Warning } = Modal();

    useEffect(()=> {
        const fetchPoint = () => {
            axios.get(`http://localhost:8080/point`)
            .then((response) => {
                if(response.data.message === "포인트게임") {
                    setPoint(response.data.point)
                }
                else {
                    Warning("포인트 게임", "로그인이 필요합니다.")
                    navigate("/signin")
                }
            })
        }
        fetchPoint();
    }, [])

    const onClickReverse = () => {
        axios.post(`http://localhost:8080/point/start`, {
            value : value,
            point : point
        })
        .then((response) => {
            if(response.data.message === "포인트게임 완료") {
                setCardValue(response.data.cardValue)
            }
            else {
                Warning("포인트 게임", "로그인이 필요합니다.")
                navigate("/signin")
            }
        })
    }

    const onClickCard = (e) => {
        setValue(e.target.value)
    }

    console.log(cardValue)
    

    return(
        <>
        <div className="game-place">
            <Div>N</Div>
            <DivR>R</DivR>
            <DivSR>SR</DivSR>
            <DivUR>UR</DivUR>
            <Normal></Normal>

              <input type="radio" name="card" value="card" onClick={onClickCard} readOnly/>
              <input type="radio" name="card" value="radio-num-2"  onClick={onClickCard} readOnly/>
             <input type="radio" name="card" value="radio-num-3" onClick={onClickCard} readOnly/>
              <input type="radio" name="card" value="radio-num-4" onClick={onClickCard} readOnly/>

    </div>
    
    <form >
        <button className="game-button" id="select-card" type="button" onClick={onClickReverse}>뒤집기</button>
        <input className="result-area" id="card-result" /><p></p>
        {point}
    </form>
    </>
    )
}

export default Point;