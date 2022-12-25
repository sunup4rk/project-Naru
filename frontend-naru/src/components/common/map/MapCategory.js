import { useEffect, useState } from "react";
import styled from "styled-components";

const Map = styled.div`
    width: 90%;
    height: 25rem;
    border: 1px solid #D1D9DE;
`;

const MapCategory = (props) => {
    const [ location, setLocation ] = useState({
        lat: 0.0,
        lon: 0.0
    })

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

            const map = new window.kakao.maps.Map(container, options); // 지도를 생성합니다

            // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
            const infowindow = new window.kakao.maps.InfoWindow({zIndex:1});


            // 장소 검색 객체를 생성합니다
            const ps = new window.kakao.maps.services.Places(map); 

            if (props.search) {
                ps.keywordSearch(props.value, placesSearchCB, {
                    radius : 3000,
                    location: new window.kakao.maps.LatLng(location.lat, location.lon)
                }); 
    
                // 키워드 검색 완료 시 호출되는 콜백함수 입니다
                function placesSearchCB (data, status, pagination) {
                    if (status === window.kakao.maps.services.Status.OK) {
    
                        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                        // LatLngBounds 객체에 좌표를 추가합니다
                        var bounds = new window.kakao.maps.LatLngBounds();
    
                        for (var i=0; i<data.length; i++) {
                            displayMarker(data[i]);    
                            bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
                        }       
    
                        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                        map.setBounds(bounds);
                    } 
                }
    
                // 지도에 마커를 표시하는 함수입니다
                function displayMarker(place) {
                    
                    // 마커를 생성하고 지도에 표시합니다
                    var marker = new window.kakao.maps.Marker({
                        map: map,
                        position: new window.kakao.maps.LatLng(place.y, place.x) 
                    });
    
                    // 마커에 클릭이벤트를 등록합니다
                    window.kakao.maps.event.addListener(marker, 'click', function() {
                        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                        infowindow.open(map, marker);
                    });
                }
            }
            else {
            // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
            if (navigator.geolocation) {
                
                // GeoLocation을 이용해서 접속 위치를 얻어옵니다
                navigator.geolocation.getCurrentPosition(function(position) {
                    
                    const lat = position.coords.latitude, // 위도
                        lon = position.coords.longitude; // 경도

                        setLocation({lat: lat, lon: lon});
                    
                    const locPosition = new window.kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                        message = '<div style="padding:5px;">주변을 둘러볼까요?</div>'; // 인포윈도우에 표시될 내용입니다
                    
                    // 마커와 인포윈도우를 표시합니다
                    displayMarker(locPosition, message);
                        
                });
                
            } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
                
                const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667),    
                    message = 'geolocation을 사용할 수 없어요..'
                    
                displayMarker(locPosition, message);
            }

            // 지도에 마커와 인포윈도우를 표시하는 함수입니다
            function displayMarker(locPosition, message) {

                // 마커를 생성합니다
                var marker = new window.kakao.maps.Marker({  
                    map: map, 
                    position: locPosition
                }); 
                
                var iwContent = message, // 인포윈도우에 표시할 내용
                    iwRemoveable = true;

                // 인포윈도우를 생성합니다
                var infowindow = new window.kakao.maps.InfoWindow({
                    content : iwContent,
                    removable : iwRemoveable
                });
                
                // 인포윈도우를 마커위에 표시합니다 
                infowindow.open(map, marker);
                
                // 지도 중심좌표를 접속위치로 변경합니다
                map.setCenter(locPosition);      
            }    
        }
        });
    };
    }, [props.search]);

    return (
        <Map id="map" />
    );
};

export default MapCategory;