import styled from "styled-components";
import { useEffect } from "react";

const Map = styled.div`
    width: 45%;
    height: 15rem;
    border: 1px solid #D1D9DE;
`;

const MapPost = (props) => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=58129ac07f6fdda65814d3d744bfb178&autoload=false&libraries=services";
        document.head.appendChild(script);
    
        script.onload = () => {
            window.kakao.maps.load(function () {
            const container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
            const options = {
              // 지도를 생성할 때 필요한 기본 옵션
              center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표.
              level: 3, // 지도의 레벨(확대, 축소 정도)
            };
    
            const map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
    
            // 마커가 표시될 위치입니다
            const markerPosition = new window.kakao.maps.LatLng(
                33.450701,
                126.570667
            );
            // 마커를 생성합니다
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
            });
    
            // 마커가 지도 위에 표시되도록 설정합니다
            marker.setMap(map);
    
            // 주소-좌표 변환 객체를 생성합니다
            const geocoder = new window.kakao.maps.services.Geocoder();
    
            // 주소로 좌표를 검색합니다
            geocoder.addressSearch((props.address || "제주도"), function (result, status) {
              // 정상적으로 검색이 완료됐으면
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(
                        result[0].y,
                        result[0].x
                    );
    
                // 결과값으로 받은 위치를 마커로 표시합니다
                const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: coords,
                });

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
                }
            });
            });
        };
    }, [props.address]);

    return (
        <Map id="map" />
    );
};

export default MapPost;