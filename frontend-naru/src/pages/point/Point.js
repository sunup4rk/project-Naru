import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/common/modal/Modal";
import Button01 from './../../components/common/button/Button01';
import axios from 'axios';
import './Point.scss';

const Point = () => {
    const navigate = useNavigate();
    const [ point, setPoint ] = useState();
    const [ select, setSelect ] = useState();
    const [ result, setResult ] = useState();
    const { Warning } = Modal();

    useEffect(()=> {
        const fetchPoint = () => {
            axios.get(`http://localhost:8080/point`)
            .then((response) => {
                if(response.data.message === "포인트게임") {
                    setPoint(response.data.point)
                }
                else {
                    Warning("포인트 게임", response.data.message)
                    navigate("/signin")
                }
            })
        }
        fetchPoint();
    }, [result])

    const onClickReverse = () => {
        axios.post(`http://localhost:8080/point/start`, {
            value : select,
            point : point
        })
        .then((response) => {
            if(response.data.message === "포인트게임 완료") {
                setResult(response.data.cardValue)
            }
            else {
                Warning("포인트 게임", response.data.message)
            }
        })
    }

    const onChangValue = (e) => {
        setResult("")
        setSelect(e.target.value)
    }

    return(
        <div className="game">
            <h1>카드 뽑기</h1>
            <p>한 장의 카드를 고르세요.</p>
            <span>나의 포인트 : <strong>{point}</strong> P</span>

            <div className="game__list">
                <div className="game__card">
                    {(select === "first" && result === "N") && <img src="/images/card/N.svg" alt="card" />}
                    {(select === "first" && result === "R") && <img src="/images/card/R.svg" alt="card" />}
                    {(select === "first" && result === "SR") && <img src="/images/card/SR.svg" alt="card" />}
                    {(select === "first" && result === "UR") && <img src="/images/card/UR.svg" alt="card" />}
                    {(!result || select !== "first") && <img src="/images/card/default.svg" alt="card" />}
                    <input type="radio" name="card"  id="select01" value="first"onChange={onChangValue} />
                    <label htmlFor="select01">선택</label>
                </div>

                <div className="game__card">
                    {(select === "second" && result === "N") && <img src="/images/card/N.svg" alt="card" />}
                    {(select === "second" && result === "R") && <img src="/images/card/R.svg" alt="card" />}
                    {(select === "second" && result === "SR") && <img src="/images/card/SR.svg" alt="card" />}
                    {(select === "second" && result === "UR") && <img src="/images/card/UR.svg" alt="card" />}
                    {(!result || select !== "second") && <img src="/images/card/default.svg" alt="card" />}
                    <input type="radio" name="card" id="select02" value="second" onChange={onChangValue} />
                    <label htmlFor="select02">선택</label>
                </div>

                <div className="game__card">
                    {(select === "third" && result === "N") && <img src="/images/card/N.svg" alt="card" />}
                    {(select === "third" && result === "R") && <img src="/images/card/R.svg" alt="card" />}
                    {(select === "third" && result === "SR") && <img src="/images/card/SR.svg" alt="card" />}
                    {(select === "third" && result === "UR") && <img src="/images/card/UR.svg" alt="card" />}
                    {(!result || select !== "third") && <img src="/images/card/default.svg" alt="card" />}
                    <input type="radio" name="card" value="third" id="select03" onChange={onChangValue} />
                    <label htmlFor="select03">선택</label>
                </div>

                <div className="game__card">
                    {(select === "fourth" && result === "N") && <img src="/images/card/N.svg" alt="card" />}
                    {(select === "fourth" && result === "R") && <img src="/images/card/R.svg" alt="card" />}
                    {(select === "fourth" && result === "SR") && <img src="/images/card/SR.svg" alt="card" />}
                    {(select === "fourth" && result === "UR") && <img src="/images/card/UR.svg" alt="card" />}
                    {(!result || select !== "fourth") && <img src="/images/card/default.svg" alt="card" />}
                    <input type="radio" name="card" value="fourth" id="select04" onChange={onChangValue} />
                    <label htmlFor="select04">선택</label>
                </div>
            </div>

            {!result && <p>1회당 100 포인트가 차감됩니다.</p>}
            {result === "N" && <p>20 포인트 당첨! </p>}
            {result === "R" && <p>45 포인트 당첨!</p>}
            {result === "SR" && <p>200 포인트 당첨! 🎉</p>}
            {result === "UR" && <p>🎉 400 포인트 당첨! 🎉</p>}
            <Button01 text={"뒤집기"} onClick={onClickReverse} size={"s"}/>
        </div>
    )
}

export default Point;