import React from 'react';
import './Intro.css';

const Intro = () => {
  const babyInfo = {
    name: '오시훈',
    birthDate: '2025년 2월 12일',
    birthTime: '오후 2시 42분',
    birthWeight: '3.31kg',
    gender: '남아',
    bloodType: 'O형',
    description: '우리 집에 온 작은 천사 시훈이가 \n벌써 첫 돌을 맞이했습니다.\n밝은 미소로 우리 가족에게 \n행복을 주는 시훈이,\n건강하고 씩씩하게 자라주길 바랍니다.',
  };

  return (
    <section className='intro__container' id='intro'>
      <div className='intro__content'>
        <h2 className='section__title'>시훈이를 소개합니다</h2>
        
        <div className='intro__profile'>
          <div className='intro__profile-image'>
            <img 
              src='/ohsihun-1st-HBD/images/SIHUN_12.jpg' 
              alt='시훈이 프로필'
            />
          </div>
          
          <div className='intro__info'>
            <h3 className='intro__name'>{babyInfo.name}</h3>
            <div className='intro__details'>
              <div className='intro__detail-item'>
                <span className='detail-label'>🎂 태어난 날</span>
                <span className='detail-value'>{babyInfo.birthDate}</span>
              </div>
              <div className='intro__detail-item'>
                <span className='detail-label'>⏰ 태어난 시간</span>
                <span className='detail-value'>{babyInfo.birthTime}</span>
              </div>
              <div className='intro__detail-item'>
                <span className='detail-label'>⚖️ 태어난 몸무게</span>
                <span className='detail-value'>{babyInfo.birthWeight}</span>
              </div>
              <div className='intro__detail-item'>
                <span className='detail-label'>💉 혈액형</span>
                <span className='detail-value'>RH+ {babyInfo.bloodType}</span>
              </div>              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
