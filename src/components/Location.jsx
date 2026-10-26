import React, { useEffect, useRef } from 'react';
import './Location.css';

const locationInfo = {
  venue: '다연재',
  address: '세종 부강면 갈산길 73',
  detailAddress: '(우)30071',
  lat: 36.5384699706392,
  lng: 127.362736023159,
  naverMapUrl: 'https://map.naver.com/p/search/다연재', // 실제 장소 링크로 변경
  kakaoMapUrl: 'https://map.kakao.com/link/search/다연재', // 실제 장소 링크로 변경
};

const Location = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // 네이버 지도 API 로드 확인
    if (!window.naver || !window.naver.maps) {
      console.error('네이버 지도 API가 로드되지 않았습니다.');
      return;
    }

    // 지도 생성
    const mapOptions = {
      center: new window.naver.maps.LatLng(locationInfo.lat, locationInfo.lng),
      zoom: 18,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      draggable: true,
      scrollWheel: true,
      disableDoubleClickZoom: true,
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);

    // 마커 생성
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(locationInfo.lat, locationInfo.lng),
      map: map,
      title: locationInfo.venue,
    });

    // 정보창 생성
    const infoWindow = new window.naver.maps.InfoWindow({
      content: `
        <div style="padding: 15px; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #2c5282; font-size: 16px; font-weight: bold;">
            ${locationInfo.venue}
          </h4>
          <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;">
            ${locationInfo.address}
          </p>
        </div>
      `,
    });

    // 마커 클릭 시 정보창 열기/닫기
    window.naver.maps.Event.addListener(marker, 'click', () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });

    // 페이지 로드 시 정보창 자동으로 열기
    infoWindow.open(map, marker);

    // 정리: 개발 모드 StrictMode에서 같은 div에 지도가 두 번 만들어지지 않도록 파괴한다
    return () => {
      map.destroy();
    };
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(locationInfo.address);
    alert('주소가 복사되었습니다.');
  };

  return (
    <section className='location__container' id='location'>
      <div>
        <h2 className='section__title'>{locationInfo.venue}</h2>
        <p className='section__subtitle'>
          {locationInfo.address}
          <br />
          {locationInfo.detailAddress}
        </p>
        <button className='copy-address-btn' onClick={handleCopyAddress}>
          📋 주소 복사
        </button>
      </div>

      {/* 네이버 지도 */}
      <div className='location__map-wrapper'>
        <div ref={mapRef} className='naver-map'></div>
      </div>

      {/* 지도 링크 버튼 */}
      <div className='location-button-wrapper'>
        <div className='button-group'>
          <a
            href={locationInfo.naverMapUrl}
            target='_blank'
            rel='noreferrer'
            className='button button-primary'
          >
            네이버지도 📍
          </a>
          <a
            href={locationInfo.kakaoMapUrl}
            target='_blank'
            rel='noreferrer'
            className='button button-reverse'
          >
            카카오지도 📍
          </a>
        </div>
      </div>

      {/* 교통편 안내 */}
      <div className='location__info'>
        <h3 className='info-title'>🚗 오시는 길</h3>
        <div className='info-content'>
          <div className='info-item'>
            <strong>🅿️ 주차</strong>
            <p>건물 주차장 이용</p>
            <img src='/ohsihun-1st-HBD/images/parking.jpg' alt='주차장 이미지' className='info-image'/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
