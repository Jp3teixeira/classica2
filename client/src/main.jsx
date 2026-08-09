import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'

// Styles — organized by responsibility
import './styles/base.css'
import './styles/desktop.css'
import './styles/menubar.css'
import './styles/dock.css'
import './styles/finder.css'
import './styles/product.css'
import './styles/notfound.css'
import './styles/responsive.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* reducedMotion="user" desativa animações de transformação quando o
          utilizador pede movimento reduzido no sistema operativo. */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
