import './Banner03.scss'

export const ExploreBanner = () => {
    return(
        <div className='Banner03'>
            <div className='Banner03-text explore'>
                    <h1>찾아보기</h1>
                    <p>현재 나의 위치정보를 기반으로 카테고리별 장소 정보를 제공합니다.</p>
            </div>
        </div>
    )
}

export const CommunityBanner = () => {
    return(
        <div className='Banner03'>
            <div className='Banner03-text community'>
                <h1>커뮤니티</h1>
                <p>좋은 장소를 찾으셨나요? 다른 회원들에게 공유하고 포인트도 받아가세요!</p>
            </div>
        </div>
    )
}

export const PointBanner = () => {
    return(
        <div className='Banner03'>
            <div className='Banner03-text point'>
                <h1>포인트 게임</h1>
            </div>
        </div>
    )
}


export const QnaBanner = () => {
    return(
        <div className='Banner03'>
            <div className='Banner03-text qna'>
                <h1>문의</h1>
                <p>궁금하신 사항이나 도움이 필요하신 사항을 문의해주세요.</p>
            </div>
        </div>
    )
}


export const MypageBanner = () => {

    return(
        <div className='Banner03'>
            <div className='Banner03-text mypage'>
                <h1>마이페이지</h1>
            </div>
        </div>
    )
}
