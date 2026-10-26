import React, { useState, useEffect, useRef } from 'react';
import exifr from 'exifr';
import './Photo.css';

const PHOTO_COUNT = 24; // 사진 개수
const INITIAL_DISPLAY = 6; // 초기 표시 개수

const Photo = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const photoSectionRef = useRef(null);

  // 모달 열기
  const openModal = (index) => {
    setSelectedPhoto(index);
    document.body.style.overflow = 'hidden'; // 스크롤 방지
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto'; // 스크롤 복원
  };

  // 더보기 버튼
  const handleShowMore = () => {
    setShowAll(true);
  };

  // 닫기 버튼
  const handleCollapse = () => {
    setShowAll(false);
    // 사진 섹션 최상단으로 스크롤
    if (photoSectionRef.current) {
      photoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const displayCount = showAll ? PHOTO_COUNT : INITIAL_DISPLAY;

  return (
    <section className='photo__section' id='photo' ref={photoSectionRef}>
      <h2 className='section__title'>사진첩</h2>
      <p className='section__subtitle'>시훈이의 성장 앨범</p>

      {/* Photo Grid */}
      <div className={`photo__grid-wrapper ${!showAll ? 'collapsed' : ''}`}>
        <div className='photo__grid'>
          {Array.from({ length: displayCount }, (_, i) => (
            <div
              className='photo__grid-item'
              key={i}
              onClick={() => openModal(i + 1)}
            >
              <LazyImage
                src={`/ohsihun-1st-HBD/images/SIHUN_${i + 1}.jpg`}
                alt={`시훈이 사진 ${i + 1}`}
              />
            </div>
          ))}
        </div>
        {!showAll && <div className='photo__fade-overlay'></div>}
      </div>

      {/* 더보기/닫기 버튼 */}
      <div className='photo__button-wrapper'>
        {!showAll ? (
          <button className='photo__toggle-btn' onClick={handleShowMore}>
            더보기 ({PHOTO_COUNT - INITIAL_DISPLAY}장 더보기)
          </button>
        ) : (
          <button className='photo__toggle-btn collapse' onClick={handleCollapse}>
            접기
          </button>
        )}
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div className='photo__modal' onClick={closeModal}>
          <div className='modal__content' onClick={(e) => e.stopPropagation()}>
            <button className='modal__close' onClick={closeModal}>
              ✕
            </button>
            <img
              src={`/ohsihun-1st-HBD/images/SIHUN_${selectedPhoto}.jpg`}
              alt={`시훈이 사진 ${selectedPhoto}`}
              onClick={closeModal}
            />
          </div>
        </div>
      )}
    </section>
  );
};

// Lazy Loading 이미지 컴포넌트
const LazyImage = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [exifDate, setExifDate] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // EXIF 데이터에서 날짜 추출
  useEffect(() => {
    if (isVisible) {
      const extractExifDate = async () => {
        try {
          const exif = await exifr.parse(src, { pick: ['DateTimeOriginal', 'DateTime', 'CreateDate'] });
          if (exif) {
            const date = exif.DateTimeOriginal || exif.DateTime || exif.CreateDate;
            if (date) {
              const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              setExifDate(formattedDate);
            }
          }
        } catch (error) {
          console.log('EXIF 데이터를 읽을 수 없습니다:', error);
        }
      };
      extractExifDate();
    }
  }, [isVisible, src]);

  return (
    <div ref={imgRef} className={`lazy-load ${isVisible ? 'is-visible' : ''}`}>
      {isVisible && (
        <>
          <img
            src={src}
            alt={alt}
            loading="lazy"
          />
          {exifDate && (
            <div className="photo__date-overlay">
              <div className="date-text">{exifDate}</div>
              <div className="caption-text">시훈이😍</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Photo;
