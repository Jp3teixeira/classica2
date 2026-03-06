import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import MenuBar from './components/MenuBar/MenuBar';
import Desktop from './components/Desktop/Desktop';
import Dock from './components/Dock/Dock';
import FinderWindow from './components/Finder/FinderWindow';
import AdminGuide from './components/Admin/AdminGuide';
import NotFound from './components/NotFound/NotFound';

import CATEGORIES from './data/categories';

// ─── Main site ────────────────────────────────────────────────────────────────

function MainSite() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Relógio da MenuBar — atualiza a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const openCategory = (categoryId) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      setActiveCategory(category);
      setIsFinderOpen(true);
    }
  };

  const closeFinder = () => {
    setIsFinderOpen(false);
    setTimeout(() => setActiveCategory(null), 300);
  };

  // Fechar janela com Escape
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape' && isFinderOpen) closeFinder(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinderOpen]);

  return (
    <>
      {/* 🚧 Banner de desenvolvimento — remover quando o site estiver pronto */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'linear-gradient(90deg, #1d1d1f 0%, #3a3a3c 100%)',
        color: 'rgba(255,255,255,0.9)', textAlign: 'center',
        padding: '6px 16px', fontSize: '12px', fontWeight: '500',
        letterSpacing: '0.02em', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '8px'
      }}>
        <span style={{ fontSize: '14px' }}>🚧</span>
        <span>Site em desenvolvimento — algumas funcionalidades podem estar incompletas</span>
        <span style={{ fontSize: '14px' }}>🚧</span>
      </div>

      <MenuBar categories={CATEGORIES} onCategoryClick={openCategory} currentTime={currentTime} />
      <Desktop />
      <Dock categories={CATEGORIES} onCategoryClick={openCategory} />

      {isFinderOpen && activeCategory && (
        <FinderWindow category={activeCategory} onClose={closeFinder} />
      )}
    </>
  );
}

// ─── App (rotas) ──────────────────────────────────────────────────────────────

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/admin/:token" element={<AdminGuide />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
