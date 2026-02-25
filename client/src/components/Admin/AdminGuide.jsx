import './AdminGuide.css';
import { useParams, Navigate } from 'react-router-dom';

// Token de acesso — muda esta palavra para proteger a página
const ADMIN_TOKEN = 'classica2024admin';

function AdminGuide() {
    const { token } = useParams();

    // Verifica o token
    if (token !== ADMIN_TOKEN) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="guide-container">
            <div className="guide-card">
                <div className="guide-header">
                    <span className="guide-icon">📋</span>
                    <h1>Guia de Gestão do Site</h1>
                    <p className="guide-subtitle">Clássica Artes Gráficas</p>
                </div>

                <div className="guide-content">

                    {/* Como adicionar produto */}
                    <section className="guide-section">
                        <h2><span>➕</span> Como adicionar um produto novo</h2>
                        <p>Abre o ficheiro:</p>
                        <code className="guide-path">client/src/components/Finder/FinderWindow.jsx</code>
                        <p>Procura a categoria certa (ex: <strong>LIVROS</strong>, <strong>CALENDÁRIOS</strong>) e copia um bloco de produto existente:</p>
                        <pre className="guide-code">{`{
    id: 'id-unico',          // ex: 'lm8' (nunca repetir!)
    name: 'Nome do Produto',
    description: 'Descrição detalhada...',
    image: '/imagens/pasta/ficheiro.jpg',
    characteristics: [
        { label: 'Papel', value: '250g' },
        { label: 'Formato', value: 'A4' }
    ]
},`}</pre>
                    </section>

                    {/* Como adicionar imagem */}
                    <section className="guide-section">
                        <h2><span>🖼️</span> Como adicionar uma imagem</h2>
                        <ol>
                            <li>Coloca a imagem na pasta: <code>client/public/imagens/nome-da-pasta/</code></li>
                            <li>No produto, usa o caminho: <code>/imagens/nome-da-pasta/ficheiro.jpg</code></li>
                            <li>Faz push para o GitHub — o site atualiza automaticamente!</li>
                        </ol>
                        <div className="guide-tip">
                            <span>💡</span>
                            <span>As imagens devem ser JPG ou PNG, idealmente com menos de 500KB para carregar rápido.</span>
                        </div>
                    </section>

                    {/* Como publicar alterações */}
                    <section className="guide-section">
                        <h2><span>🚀</span> Como publicar alterações no site</h2>
                        <p>Abre o terminal na pasta do projeto e corre:</p>
                        <pre className="guide-code">{`git add .
git commit -m "descrição do que mudaste"
git push`}</pre>
                        <p>O Vercel atualiza o site automaticamente em 1-2 minutos! ✅</p>
                    </section>

                    {/* Banner de desenvolvimento */}
                    <section className="guide-section">
                        <h2><span>🚧</span> Como remover o banner "Em desenvolvimento"</h2>
                        <p>Abre <code>client/src/App.jsx</code> e apaga o bloco:</p>
                        <pre className="guide-code">{`{/* 🚧 Banner de desenvolvimento */}
<div style={{ ... }}>
    ...
</div>`}</pre>
                        <p>Depois faz push para o GitHub.</p>
                    </section>

                    {/* Estrutura de pastas */}
                    <section className="guide-section">
                        <h2><span>📁</span> Estrutura das pastas</h2>
                        <pre className="guide-code">{`classica2/
└── client/
    ├── public/
    │   └── imagens/
    │       ├── livros/      ← imagens dos livros
    │       ├── calendarios/ ← imagens dos calendários
    │       └── logo/        ← logo da empresa
    └── src/
        ├── App.jsx          ← categorias e rotas
        └── components/
            └── Finder/
                └── FinderWindow.jsx  ← PRODUTOS`}</pre>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default AdminGuide;
