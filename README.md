# Clássica Artes Gráficas — Site Oficial

Site institucional da Clássica Artes Gráficas, disponível em [www.classicaag.pt](https://www.classicaag.pt).

## 🌐 Stack

- **Frontend**: React + Vite
- **Deploy**: Vercel (automático via GitHub)
- **Domínio**: amen.pt → Vercel

## 📁 Estrutura

```
classica2/
└── client/
    ├── public/
    │   └── imagens/
    │       ├── livros/       ← imagens dos livros
    │       ├── calendarios/  ← imagens dos calendários
    │       └── logo/         ← logo da empresa
    └── src/
        ├── App.jsx           ← categorias do menu
        └── components/
            └── Finder/
                └── FinderWindow.jsx  ← produtos e imagens
```

## ➕ Como adicionar um produto

1. Abre `client/src/components/Finder/FinderWindow.jsx`
2. Encontra a categoria certa na função `getProducts()`
3. Adiciona um novo objeto de produto:

```js
{
    id: 'id-unico',
    name: 'Nome do Produto',
    description: 'Descrição...',
    image: '/imagens/pasta/ficheiro.jpg',
    characteristics: [
        { label: 'Papel', value: '250g' }
    ]
}
```

4. Coloca a imagem em `client/public/imagens/`

## 🚀 Como publicar alterações

```bash
git add .
git commit -m "descrição da alteração"
git push
```

O Vercel atualiza o site automaticamente em 1-2 minutos.

## 🔐 Painel de gestão

Acede ao guia de gestão em:
```
https://www.classicaag.pt/admin/classica2024admin
```

## 🚧 Banner de desenvolvimento

Para remover o banner "Em desenvolvimento", apaga o bloco marcado com
`{/* 🚧 Banner de desenvolvimento */}` em `client/src/App.jsx` e faz push.
