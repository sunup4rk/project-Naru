import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/common/modal/Modal";
import { Pane, Dialog } from 'evergreen-ui';
import Button01 from './../../components/common/button/Button01';
import axios from 'axios';
import './Point.scss';

const Point = () => {
    const navigate = useNavigate();
    const [ point, setPoint ] = useState();
    const [ select, setSelect ] = useState();
    const [ result, setResult ] = useState();
    const { Warning } = Modal();
    const [ isShown, setIsShown ] = useState(false);

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
        if (!select) {
            Warning("카드 뽑기", "카드를 선택해주세요.")
        } else {
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
    }

    const onChangValue = (e) => {
        setResult("")
        setSelect(e.target.value)
    }

    const onClickHelp = () => {
        setIsShown(true)
    }

    return(
        <>
            <Pane>
                <Dialog
                isShown={isShown}
                title="카드 뽑기"
                onCloseComplete={() => setIsShown(false)}
                hasFooter={false}
                minHeightContent={"250px"}>
                <div className="game__modal">
                    <div className="game__modal__content">
                        <img src="/images/card/N.svg"/>
                        <span>20 포인트 (60%)</span>
                    </div>
                    <div className="game__modal__content">
                        <img src="/images/card/R.svg"/>
                        <span>50 포인트 (30%)</span>
                    </div>
                    <div className="game__modal__content">
                        <img src="/images/card/SR.svg"/>
                        <span>400 포인트 (9%)</span>
                    </div>
                    <div className="game__modal__content">
                        <img src="/images/card/UR.svg"/>
                        <span>1000 포인트 (1%)</span>
                    </div>
                </div>
                </Dialog>
            </Pane>

            <div className="game">
                <h1>카드 뽑기<button onClick={onClickHelp}>?</button></h1>
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
                {result === "R" && <p>50 포인트 당첨!</p>}
                {result === "SR" && <p>400 포인트 당첨! 🎉</p>}
                {result === "UR" && <p>🎉 1000 포인트 당첨! 🎉</p>}
                <Button01 text={"뒤집기"} onClick={onClickReverse} size={"s"}/>
            </div>
        </>
    )
}

export default Point;