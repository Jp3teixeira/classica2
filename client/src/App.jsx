import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MenuBar from './components/MenuBar/MenuBar'
import Desktop from './components/Desktop/Desktop'
import Dock from './components/Dock/Dock'
import FinderWindow from './components/Finder/FinderWindow'
import { AdminDashboard } from './components/Admin'

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
      { id: 'livros-capa-dura', name: 'Capa Dura' },
      { id: 'livros-brochura', name: 'Brochura' },
      { id: 'livros-encadernacao', name: 'Encadernação Especial' },
      { id: 'livros-edicoes-limitadas', name: 'Edições Limitadas' }
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
      { id: 'embalagens-alimentar', name: 'Embalagem Alimentar' },
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

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Open Finder with a specific category
  const openCategory = (categoryId) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      setActiveCategory(category);
      setIsFinderOpen(true);
    }
  };

  // Close Finder
  const closeFinder = () => {
    setIsFinderOpen(false);
    setTimeout(() => {
      setActiveCategory(null);
    }, 300);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFinderOpen) {
        closeFinder();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinderOpen]);

  return (
    <>
      {/* Menu Bar */}
      <MenuBar
        categories={CATEGORIES}
        onCategoryClick={openCategory}
        currentTime={currentTime}
      />

      {/* Desktop with Logo */}
      <Desktop />

      {/* Dock */}
      <Dock
        categories={CATEGORIES}
        onCategoryClick={openCategory}
      />

      {/* Finder Window */}
      {isFinderOpen && activeCategory && (
        <FinderWindow
          category={activeCategory}
          onClose={closeFinder}
        />
      )}
    </>
  );
}

// App with routes
function App() {
  return (
    <Routes>
      {/* Main site */}
      <Route path="/" element={<MainSite />} />

      {/* Admin panel with secret token */}
      <Route path="/admin/:token" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App
