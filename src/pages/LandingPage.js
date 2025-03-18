import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

const LandingPage = () => {
    const location = useLocation()

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.replace("#", ""));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <div className='pt-16 bg-blue-50' id='landingPage'>
            <Header/>
            <HeroSection/>
            <Features/>
            <About/>
            <Testimonials/>
            <CTASection/>
            <Footer/>
        </div>
)};

export default LandingPage;