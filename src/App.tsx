/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AdminProvider } from '@/context/AdminContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Home from '@/pages/Home';
import Itinerary from '@/pages/Itinerary';
import About from '@/pages/About';
import Which from '@/pages/Which';
import Test from '@/pages/Test';
import { useEffect } from 'react';

function ScrollToTopOnMount() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LanguageRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasPrompted = localStorage.getItem('languagePromptShown');
    const isHungarian = navigator.language.startsWith('hu');
    
    if (isHungarian && !hasPrompted && location.pathname !== '/which' && location.pathname !== '/test') {
      navigate('/which');
    }
  }, [navigate, location.pathname]);

  return null;
}

function AppContent() {
  useEffect(() => {
    // Set document title
    document.title = "viators.hu";

    // Fetch profile picture for favicon
    fetch('/api/settings/profile_picture')
      .then(res => res.json())
      .then(data => {
        if (data.value) {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              const dataUrl = canvas.toDataURL('image/png');
              const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
              if (link) {
                link.href = dataUrl;
              } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = dataUrl;
                document.head.appendChild(newLink);
              }
            }
          };
          img.src = data.value;
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <LanguageRedirect />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/hu" element={<Home />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/itinerary/hu" element={<Itinerary />} />
        <Route path="/hu/itinerary" element={<Itinerary />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/hu" element={<About />} />
        <Route path="/hu/about" element={<About />} />
        <Route path="/which" element={<Which />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <Router>
          <ScrollToTopOnMount />
          <AppContent />
        </Router>
      </AdminProvider>
    </LanguageProvider>
  );
}

