/**
 * Categorias de produtos da Clássica Artes Gráficas.
 * Para adicionar uma nova categoria, basta adicionar um novo objeto a este array
 * e adicionar os produtos correspondentes em products.js.
 */
const CATEGORIES = [
    {
        id: 'catalogos',
        name: 'Catálogos',
        icon: '📋',
        description: 'Catálogos profissionais para apresentação de produtos e serviços',
        subcategories: [
            { id: 'catalogos-todos', name: 'Catálogos' }
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
            { id: 'embalagens-micro-canelado', name: 'Micro Canelado' },
            { id: 'embalagens-cartolina', name: 'Cartolina' }
        ]
    },
    {
        id: 'rotulagem',
        name: 'Rotulagem',
        icon: '🏷️',
        description: 'Rótulos e etiquetas para todos os tipos de produtos',
        subcategories: [
            { id: 'rotulos', name: 'Rótulos' }
        ]
    },
    {
        id: 'outros',
        name: 'Outros',
        icon: '🗂️',
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
