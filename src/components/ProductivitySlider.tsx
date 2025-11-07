import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { SliderCardData } from '../types';

export const ProductivitySlider: FC<{ sliderData: SliderCardData[], onCategoryClick: (category: string) => void }> = ({ sliderData, onCategoryClick }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const isMobile = useCallback(() => window.matchMedia("(max-width:767px)").matches, []);

    const center = useCallback((i: number) => {
        const track = trackRef.current;
        if (!track || !track.parentElement) return;
        const card = track.children[i] as HTMLElement;
        if (!card) return;

        const isMobileView = isMobile();
        const axis = isMobileView ? "top" : "left";
        const size = isMobileView ? "clientHeight" : "clientWidth";
        const start = isMobileView ? card.offsetTop : card.offsetLeft;

        const scrollPosition = isMobileView
            ? start
            : start - (track.parentElement[size] / 2 - card[size] / 2);

        track.parentElement.scrollTo({
            [axis]: scrollPosition,
            behavior: "smooth"
        });
    }, [isMobile]);

    const activate = useCallback((i: number, scroll: boolean) => {
        setCurrent(i);
        if (scroll) center(i);
    }, [center]);

    const go = useCallback((step: number) => {
        const newIndex = (current + step + sliderData.length) % sliderData.length;
        activate(newIndex, true);
    }, [current, activate, sliderData.length]);

    const startAutoScroll = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            go(1);
        }, 5000);
    }, [go]);

    const stopAutoScroll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, [startAutoScroll]);

    useEffect(() => {
        center(current);
        const handleResize = () => center(current);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [current, center]);

    return (
        <section
            className="slider-section"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
        >
            <div className="slider-container">
                <div className="slider-track" ref={trackRef}>
                    {sliderData.map((card, i) => (
                        <article
                            key={i}
                            className="project-card"
                            data-active={i === current ? true : undefined}
                            onClick={() => activate(i, true)}
                        >
                            <img className="project-card__bg" src={card.bgImage} alt="" />
                            <div className="project-card__content">
                                <img className="project-card__thumb" src={card.thumbImage} alt="" />
                                <div>
                                    <h3 className="project-card__title">{card.title}</h3>
                                    <p className="project-card__desc">{card.description}</p>
                                    <button className="project-card__btn" onClick={(e) => { e.stopPropagation(); onCategoryClick(card.title); }}>View all {card.title}</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <div className="slider-dots">
                {sliderData.map((_, i) => (
                    <span
                        key={i}
                        className={`slider-dot ${i === current ? 'active' : ''}`}
                        onClick={() => activate(i, true)}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProductivitySlider;