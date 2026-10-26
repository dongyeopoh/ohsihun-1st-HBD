import React from 'react';
import './Home.css';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const contentsVariants = {
  start: {
    opacity: 0,
    scale: 0.5,
  },
  end: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      duration: 0.5,
      bounce: 0.5,
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const eachVariants = {
  start: {
    opacity: 0,
    y: 20,
  },
  end: {
    opacity: 1,
    y: 0,
  },
};

const Home = () => {
  return (
    <section className='home__container'>
      <div className='home__content'>
        {/* Animated Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.4,
            delay: 1,
          }}
          className='home__img'
        ></motion.div>

        {/* Text Contents */}
        <motion.div
          variants={contentsVariants}
          initial='start'
          animate='end'
          className='home__text-block'
        >
          <motion.h1 variants={eachVariants} className='home__title'>
            시훈이의
            <br />첫 생일 <span className='home__palm'>👋🏻</span>
          </motion.h1>

          <motion.h2 variants={eachVariants} className='home__subtitle'>
            2026.01.31 (토) 오후 12시 00분
          </motion.h2>

          <motion.p variants={eachVariants} className='home__description'>
            사랑스러운 저희 아이가 벌써 첫 돌을 맞이합니다.
            <br />
            함께 축하해 주세요 💝
          </motion.p>

          <motion.div variants={eachVariants} className='button-group'>
            {/* <a href='#intro' className='button button-reverse'>
              👶 시훈이 소개
            </a> */}
            <a href='#photo' className='button button-primary'>
              📷 사진보기
            </a>
            <a href='#location' className='button button-reverse'>
              📍 위치보기
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className='home__scroll'>
        <span className='home__scroll-name'>아래로 스크롤</span>
        <div className='wheel'>↓</div>
      </div>
    </section>
  );
};

export default Home;
