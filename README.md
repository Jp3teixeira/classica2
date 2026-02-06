# Clássica 2 - Artes Gráficas 🖨️

Website institucional da **Clássica Artes Gráficas** com interface estilo macOS.

![macOS Style Interface](./classicalogo/classica2.png)

## 🚀 Stack Tecnológica

### Frontend
- **React 18** + Vite
- **Framer Motion** - Animações
- **CSS Vanilla** - Estilização (design system próprio)
- **React Router** - Navegação

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** - Autenticação
- **Multer** - Upload de ficheiros
- **Cloudinary** - Hosting de imagens (opcional)

## 📁 Estrutura do Projeto

```
classica2/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Desktop/      # Fundo macOS + logo
│   │   │   ├── Dock/         # Barra inferior animada
│   │   │   ├── MenuBar/      # Barra superior macOS
│   │   │   └── Finder/       # Modal estilo Finder
│   │   ├── assets/           # Imagens e recursos
│   │   └── index.css         # Design system
│   └── package.json
│
├── server/                    # Backend Node.js
│   ├── src/
│   │   ├── models/           # Modelos MongoDB
│   │   ├── routes/           # API REST
│   │   │   ├── auth.js       # Autenticação
│   │   │   ├── products.js   # CRUD produtos
│   │   │   ├── categories.js # Categorias
│   │   │   └── upload.js     # Upload imagens
│   │   └── middleware/       # Auth middleware
│   └── package.json
│
└── README.md
```

## 🛠️ Instalação

### Requisitos
- Node.js 18+
- MongoDB (local ou Atlas)

### Passos

1. **Clonar o repositório**
```bash
git clone https://github.com/seu-user/classica2.git
cd classica2
```

2. **Instalar dependências do frontend**
```bash
cd client
npm install
```

3. **Instalar dependências do backend**
```bash
cd ../server
npm install
```

4. **Configurar variáveis de ambiente**
```bash
# Copiar .env.example para .env no server/
cp .env.example .env
# Editar com as suas credenciais
```

5. **Iniciar MongoDB** (se local)
```bash
mongod
```

6. **Iniciar o servidor**
```bash
cd server
npm run dev
```

7. **Iniciar o frontend** (noutra janela)
```bash
cd client
npm run dev
```

8. **Aceder ao site**
   - Frontend: http://localhost:5173
   - API: http://localhost:5000

## 📦 Categorias de Produtos

- 📋 **Catálogos** - Catálogos comerciais, industriais, moda
- 📚 **Livros** - Capa dura, brochura, encadernação especial
- 📦 **Embalagens** - Cartão, rígidas, alimentar, cosmética
- 🏷️ **Rotulagem** - Vinhos, alimentar, industrial, adesivas
- 🖨️ **Impressão Digital** - Grande formato, pequeno formato, personalização

## 🎨 Funcionalidades

### Interface macOS
- ✅ Menu bar superior com navegação
- ✅ Dock animado que aparece/desaparece
- ✅ Janelas estilo Finder
- ✅ Animações suaves com Framer Motion
- ✅ Traffic lights (fechar, minimizar, maximizar)
- ✅ Sidebar de navegação no Finder

### Admin (em desenvolvimento)
- [ ] Login de administrador
- [ ] Adicionar/editar/remover produtos
- [ ] Upload de imagens
- [ ] Gerir categorias

## 🌐 Deploy

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy via Vercel CLI ou GitHub integration
```

### Backend (Railway)
```bash
# Push para GitHub
# Conectar repositório ao Railway
```

## 📝 Licença

Este projeto é propriedade da Clássica Artes Gráficas.

---

Desenvolvido com ❤️ por João Teixeira