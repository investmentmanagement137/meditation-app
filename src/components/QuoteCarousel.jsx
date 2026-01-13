import React, { useState, useRef } from 'react';

const QuoteCarousel = ({ quotes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
    };

    const handleSwipe = () => {
        if (touchEndX.current < touchStartX.current - 50) nextSlide();
        if (touchEndX.current > touchStartX.current + 50) prevSlide();
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    };

    if (quotes.length === 0) return null;

    return (
        <div
            className="quote-carousel-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {quotes.map((q, i) => (
                <div
                    key={i}
                    className={`quote-slide ${i === currentIndex ? 'active' : ''}`}
                >
                    <div className="quote-text">"{q.text}"</div>
                    {q.author && <div className="quote-author">{q.author}</div>}
                </div>
            ))}

            {quotes.length > 1 && (
                <div className="carousel-dots">
                    {quotes.map((_, i) => (
                        <div
                            key={i}
                            className={`dot ${i === currentIndex ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(i);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuoteCarousel;
