import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MenuBar from './components/MenuBar/MenuBar'
import Desktop from './components/Desktop/Desktop'
import Dock from './components/Dock/Dock'
import FinderWindow from './components/Finder/FinderWindow'
import AdminGuide from './components/Admin/AdminGuide'

// Categories data
const CATEGORIES = [
  {
    id: 'catalogos',
    name: 'Catálogos',
    icon: '📋',
    description: 'Catálogos profissionais para apresentação de produtos e serviços',
    subcategories: [
      { id: 'catalogos-comerciais', name: 'Catálogos Comerciais' },
      { id: 'catalogos-industriais', name: 'Catálogos Industriais' },
      { id: 'catalogos-moda', name: 'Catálogos de Moda' },
      { id: 'catalogos-gastronomia', name: 'Catálogos Gastronómicos' }
    ]
  },
  {
    id: 'livros',
    name: 'Livros',
    icon: '📚',
    description: 'Impressão de livros de alta qualidade com diversos acabamentos',
    subcategories: [
      { id: 'livros-capa-mole', name: 'Livros de Capa Mole' },
      { id: 'livros-capa-dura', name: 'Livros de Capa Dura' }
    ]
  },
  {
    id: 'calendarios',
    name: 'Calendários de Parede',
    icon: '📅',
    description: 'Calendários de parede personalizados com vários formatos de macetes',
    subcategories: [
      { id: 'calendarios-3-macetes', name: 'Calendário 3 Macetes' },
      { id: 'calendarios-4-macetes', name: 'Calendário 4 Macetes' }
    ]
  },
  {
    id: 'embalagens',
    name: 'Embalagens',
    icon: '📦',
    description: 'Embalagens personalizadas para diversos produtos',
    subcategories: [
      { id: 'embalagens-cartao', name: 'Cartão Canelado' },
      { id: 'embalagens-rigidas', name: 'Caixas Rígidas' },
      { id: 'embalagens-alimentar', value: 'Embalagem Alimentar' },
      { id: 'embalagens-cosmeticos', name: 'Embalagem Cosméticos' },
      { id: 'embalagens-luxo', name: 'Embalagem de Luxo' }
    ]
  },
  {
    id: 'rotulagem',
    name: 'Rotulagem',
    icon: '🏷️',
    description: 'Rótulos e etiquetas para todos os tipos de produtos',
    subcategories: [
      { id: 'rotulos-vinhos', name: 'Rótulos de Vinhos' },
      { id: 'rotulos-alimentar', name: 'Rótulos Alimentar' },
      { id: 'rotulos-industriais', name: 'Rótulos Industriais' },
      { id: 'etiquetas-adesivas', name: 'Etiquetas Adesivas' }
    ]
  },
  {
    id: 'impressao-digital',
    name: 'Impressão Digital',
    icon: '🖨️',
    description: 'Impressão digital de alta qualidade para pequenas e grandes tiragens',
    subcategories: [
      { id: 'impressao-grande-formato', name: 'Grande Formato' },
      { id: 'impressao-pequeno-formato', name: 'Pequeno Formato' },
      { id: 'impressao-personalizacao', name: 'Personalização' },
      { id: 'impressao-prototipagem', name: 'Prototipagem' }
    ]
  }
];

// Main site component
function MainSite() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFinderOpen) closeFinder();
    };
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

// App routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/admin/:token" element={<AdminGuide />} />
    </Routes>
  );
}

export default App
