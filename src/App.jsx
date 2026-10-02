import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModeProvider, useMode } from './context/ModeContext';
import Home from './pages/Home';
import Services from './pages/Services';
import Process from './pages/Process';
import About from './pages/About';
import Contact from './pages/Contact';
import Cursor from './components/Cursor';
import WhatsAppCta from './components/WhatsAppCta';
import './index.css';

const MainLayout = () => {
  const { mode } = useMode();

  return (
    <div className={`site-frame ${mode === 'consulting' ? 'consulting-frame' : ''}`}>
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/process" element={<Process />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <WhatsAppCta />
    </div>
  );
};

function App() {
  return (
    <ModeProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </ModeProvider>
  );
}

export default App;
