import { useState, useEffect } from "react";
import "./style.css";
import image1 from "/images/IMG_6840-min.jpg";
import image2 from "/images/(62-2)2F9708-min.jpg";
import image3 from "/images/IMG_0707-min.jpg";
import image4 from "/images/IMG_9152-min.jpg";
import image5 from "/images/(55-2)2A7727-min.jpg";
import image6 from "/images/IMG_9148-min.jpg";
import image7 from "/images/IMG_9129-min.jpg";
import image8 from "/images/(24)1DN7101-min.jpg";
import image9 from "/images/IMG_0708-min.jpg";
import image10 from "/images/IMG_8991-min.jpg";

function RealizationDisplay() {
  const isMandarin = localStorage.getItem("isMandarin");
  
  // All images in the same order as before
  const images = [
    { src: image1, alt: "Fabric realization showcase" },
    { src: image6, alt: "Fabric showcase" },
    { src: image2, alt: "Fabric realization display" },
    { src: image7, alt: "Fabric showcase" },
    { src: image3, alt: "Fabric profile view" },
    { src: image8, alt: "Fabric collection" },
    { src: image4, alt: "Fabric hero showcase" },
    { src: image9, alt: "Fabric display" },
    { src: image5, alt: "Fabric profile display" },
    { src: image10, alt: "Fabric display" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = (isAuto = false) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (!isAuto) setIsAutoPlaying(false); // Stop auto-play on manual interaction
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 1200);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsAutoPlaying(false); // Stop auto-play on manual interaction
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 1200);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setIsAutoPlaying(false); // Stop auto-play on manual interaction
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 1200);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return;

    const autoPlayInterval = setInterval(() => {
      nextSlide(true); // true indicates this is an auto transition
    }, 2000); // Change every 2 seconds

    return () => clearInterval(autoPlayInterval);
  }, [isAutoPlaying, isTransitioning, currentIndex]);

  const getImagePosition = (imageIndex) => {
    let position = imageIndex - currentIndex;
    
    // Handle circular positioning
    if (position > images.length / 2) {
      position = position - images.length;
    } else if (position < -images.length / 2) {
      position = position + images.length;
    }
    
    return position;
  };

  return (
    <div className="carousel-realization-container">
      <h2 className="carousel-heading" data-aos="fade-up" data-aos-duration="1000">
        {isMandarin ? "布料合集" : "Realizations"}
      </h2>
      
      <div className="carousel-wrapper" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
        <button 
          className="carousel-arrow carousel-arrow-left" 
          onClick={prevSlide}
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="carousel-container">
          <div className="carousel-track">
            {images.map((image, index) => {
              const position = getImagePosition(index);
              const isVisible = Math.abs(position) <= 5; // Show more images for smoother transitions
              
              return (
                <div
                  key={index}
                  className={`carousel-slide carousel-slide-position-${position}`}
                  style={{
                    display: isVisible ? 'block' : 'none'
                  }}
                  onClick={() => {
                    if (position !== 0) {
                      goToSlide(index);
                    }
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="carousel-image"
            loading="lazy"
          />
        </div>
              );
            })}
        </div>
        </div>

        <button 
          className="carousel-arrow carousel-arrow-right" 
          onClick={nextSlide}
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        </div>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'carousel-indicator-active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default RealizationDisplay;
