/**
 * Categorias de produtos da Clássica Artes Gráficas.
 *
 * Para adicionar uma nova categoria, basta adicionar um novo objeto a este array
 * e adicionar os produtos correspondentes em products.js.
 *
 * Campos:
 *   id          usado no URL (/livros) e como chave em products.js
 *   name        nome apresentado na MenuBar, Dock e título da janela
 *   shortName   (opcional) nome curto para a barra de navegação em telemóvel
 *   description usada como subtítulo/meta description da categoria
 *   subcategories  { id, name } — o id é a chave em products.js; o segmento do
 *               URL é o id sem o prefixo da categoria ('livros-capa-dura' → 'capa-dura')
 */
const CATEGORIES = [
    {
        id: 'catalogos',
        name: 'Catálogos',
        description: 'Catálogos profissionais para apresentação de produtos e serviços',
        subcategories: [
            { id: 'catalogos-todos', name: 'Catálogos' }
        ]
    },
    {
        id: 'livros',
        name: 'Livros',
        description: 'Impressão de livros de alta qualidade com diversos acabamentos',
        subcategories: [
            { id: 'livros-capa-mole', name: 'Livros de Capa Mole' },
            { id: 'livros-capa-dura', name: 'Livros de Capa Dura' }
        ]
    },
    {
        id: 'calendarios',
        name: 'Calendários de Parede',
        shortName: 'Calendários',
        description: 'Calendários de parede personalizados com vários formatos de macetes',
        subcategories: [
            { id: 'calendarios-3-macetes', name: 'Calendário 3 Macetes' },
            { id: 'calendarios-4-macetes', name: 'Calendário 4 Macetes' }
        ]
    },
    {
        id: 'embalagens',
        name: 'Embalagens',
        description: 'Embalagens personalizadas para diversos produtos',
        subcategories: [
            { id: 'embalagens-micro-canelado', name: 'Micro Canelado' },
            { id: 'embalagens-cartolina', name: 'Cartolina' }
        ]
    },
    {
        id: 'rotulagem',
        name: 'Rotulagem',
        shortName: 'Rótulos',
        description: 'Rótulos e etiquetas para todos os tipos de produtos',
        subcategories: [
            { id: 'rotulos', name: 'Rótulos' }
        ]
    },
    {
        id: 'outros',
        name: 'Outros',
        description: 'Outros produtos gráficos: brochuras, postais, calendários de secretária e mais',
        subcategories: [
            { id: 'outros-brochuras', name: 'Brochuras' },
            { id: 'outros-postais', name: 'Postais' },
            { id: 'outros-calendarios-secretaria', name: 'Calendários de Secretária' },
            { id: 'outros-embalagens-redondas', name: 'Embalagens Redondas' }
        ]
    }
];

export default CATEGORIES;
