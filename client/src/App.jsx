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
