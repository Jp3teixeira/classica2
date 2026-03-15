/**
 * Base de dados de produtos da Clássica Artes Gráficas.
 *
 * COMO ADICIONAR UM PRODUTO:
 * 1. Encontra a categoria correta (ex: 'livros' > 'livros-capa-mole')
 * 2. Copia um bloco existente e ajusta id, name, description, image e characteristics
 * 3. Coloca a imagem em client/public/imagens/pasta-correta/
 * 4. Faz git add . && git commit -m "novo produto" && git push
 *
 * ESTRUTURA DE PASTAS (Sem acentos para evitar erros no servidor):
 * imagens/
 *   Calendarios/3M/       → calendários de parede 3 macetes
 *   Calendarios/4M/       → calendários de parede 4 macetes
 *   Catalogos/            → catálogos
 *   Embalagens/Cartolina/ → embalagens em cartolina
 *   Embalagens/Micro_Canelado_MC/ → embalagens micro canelado
 *   Livros/Capa_Dura/     → livros capa dura
 *   Livros/Capa_Mole/     → livros capa mole
 *   Logos/                → logos da empresa
 *   Outros/Brochuras/
 *   Outros/Calendarios_Secretaria/
 *   Outros/Embalagens_Redondas/
 *   Outros/Postais/
 */

const PRODUCTS = {

    // ================================================================
    // CATÁLOGOS
    // ================================================================
    'catalogos': {
        'catalogos-todos': [
            {
                id: 'cat1',
                name: 'Catálogo Frato',
                description: 'Catálogos formato A4 (21x29,7cm.) com 132 páginas impressas a 4/4 cores em papel "Edixion" 140gr. + capa em "Edixion" 350gr. com termo estampagem.\n\nAcabamento: cosidos e brochados.',
                image: '/imagens/Catalogos/Catalogo_Frato_1.jpg',
                characteristics: [
                    { label: 'Formato', value: 'A4 (21 x 29,7 cm)' },
                    { label: 'Páginas', value: '132' },
                    { label: 'Impressão miolo', value: '4/4 cores' },
                    { label: 'Papel miolo', value: 'Edixion 140gr' },
                    { label: 'Papel capa', value: 'Edixion 350gr' },
                    { label: 'Capa', value: 'Com termo estampagem' },
                    { label: 'Acabamento', value: 'Cosidos e brochados' }
                ]
            },
            {
                id: 'cat2',
                name: 'Catálogo Madalena',
                description: '100 Brochuras no formato A4 com 24 páginas impressas a 4/4 cores em Munken Lynx 150gr.\n\nCapa com aba impressa a 4/4 cores em Munken Lynx 300gr.\nAcabamento: agrafado.',
                image: '/imagens/Catalogos/Catalogo_Madalena_2.jpg',
                characteristics: [
                    { label: 'Formato', value: 'A4' },
                    { label: 'Páginas', value: '24' },
                    { label: 'Impressão miolo', value: '4/4 cores' },
                    { label: 'Papel miolo', value: 'Munken Lynx 150gr' },
                    { label: 'Capa', value: 'Com aba, Munken Lynx 300gr' },
                    { label: 'Impressão capa', value: '4/4 cores' },
                    { label: 'Acabamento', value: 'Agrafado' }
                ]
            },
            {
                id: 'cat3',
                name: 'Catálogo Valadares',
                description: '100 Brochuras no formato A4 com 24 páginas impressas a 4/4 cores em Munken Lynx 150gr.\n\nCapa com aba impressa a 4/4 cores em Munken Lynx 300gr.\nAcabamento: agrafado.',
                image: '/imagens/Catalogos/Catalogo_Valadares_3.jpg',
                characteristics: [
                    { label: 'Formato', value: 'A4' },
                    { label: 'Páginas', value: '24' },
                    { label: 'Impressão miolo', value: '4/4 cores' },
                    { label: 'Papel miolo', value: 'Munken Lynx 150gr' },
                    { label: 'Capa', value: 'Com aba, Munken Lynx 300gr' },
                    { label: 'Impressão capa', value: '4/4 cores' },
                    { label: 'Acabamento', value: 'Agrafado' }
                ]
            }
        ]
    },

    // ================================================================
    // LIVROS
    // ================================================================
    'livros': {
        'livros-capa-mole': [
            {
                id: 'lm1',
                name: 'Arte e Poesia',
                description: 'Livro de capa mole com acabamento profissional. Encadernação em brochura ideal para publicações literárias e de arte.',
                image: '/imagens/Livros/Capa_Mole/ArteEPoesia_M.jpg',
                characteristics: [
                    { label: 'Encadernação', value: 'Capa Mole' },
                    { label: 'Acabamento', value: 'Brochura' }
                ]
            },
            {
                id: 'lm2',
                name: 'As Cores de Abril',
                description: 'Obra em dois volumes, impressa em papel ior 90gr. com plastificação mate.\n\nVolume 1: 404 páginas impressas a 1/1 cor (preto).\nVolume 2: 288 páginas impressas a 1/1 cor (preto).\n\nCapa impressa a 4/0 cores + plastificação mate em cartolina cromo v/ branco 270gr.\nAcabamento: Brochado.',
                image: '/imagens/Livros/Capa_Mole/AsCoresDeAbril_M.jpg',
                characteristics: [
                    { label: 'Volumes', value: '2' },
                    { label: 'Páginas Vol. 1', value: '404' },
                    { label: 'Páginas Vol. 2', value: '288' },
                    { label: 'Impressão miolo', value: '1/1 cor (preto)' },
                    { label: 'Papel miolo', value: 'Ior 90gr' },
                    { label: 'Impressão capa', value: '4/0 cores' },
                    { label: 'Plastificação', value: 'Mate' },
                    { label: 'Papel capa', value: 'Cromo v/ branco 270gr' },
                    { label: 'Acabamento', value: 'Brochado' }
                ]
            },
            {
                id: 'lm3',
                name: 'Gramática da Língua Chinesa',
                description: 'Formato 17x24cm. com 128 páginas impressas a 1/1 cor em papel ior 80gr.\n\nCapa impressa a 4/0 cores + plastificação em cromo v/ branco 280gr.\nAcabamento: cosido e brochado.',
                image: '/imagens/Livros/Capa_Mole/GramaticaLinguaChinesa_M.jpg',
                characteristics: [
                    { label: 'Formato', value: '17 x 24 cm' },
                    { label: 'Páginas', value: '128' },
                    { label: 'Impressão miolo', value: '1/1 cor' },
                    { label: 'Papel miolo', value: 'Ior 80gr' },
                    { label: 'Impressão capa', value: '4/0 cores' },
                    { label: 'Papel capa', value: 'Cromo v/ branco 280gr' },
                    { label: 'Acabamento', value: 'Cosido e brochado' }
                ]
            },
            {
                id: 'lm4',
                name: 'Manual Chinês 123 — Livro 1',
                description: 'Formato A4, com 132 páginas impressas a 4/4 cores em papel ior 100gr.\n\nCapa com 2 badanas integrais, impressa a 4/4 cores + plastificação em cartolina cromo v/ branco 280gr.\nAcabamento: cosido e brochado.',
                image: '/imagens/Livros/Capa_Mole/LivroChines1_M.jpg',
                characteristics: [
                    { label: 'Formato', value: 'A4' },
                    { label: 'Páginas', value: '132' },
                    { label: 'Impressão miolo', value: '4/4 cores' },
                    { label: 'Papel miolo', value: 'Ior 100gr' },
                    { label: 'Capa', value: '2 badanas integrais' },
                    { label: 'Impressão capa', value: '4/4 cores + plastificação' },
                    { label: 'Papel capa', value: 'Cromo v/ branco 280gr' },
                    { label: 'Acabamento', value: 'Cosido e brochado' }
                ]
            },
            {
                id: 'lm5',
                name: 'Manual Chinês 123 — Livro 2',
                description: 'Formato A4, com 160 páginas impressas a 4/4 cores em papel ior 100gr.\n\nCapa com 2 badanas integrais, impressa a 4/4 cores + plastificação em cartolina cromo v/ branco 280gr.\nAcabamento: cosido e brochado.',
                image: '/imagens/Livros/Capa_Mole/LivroChines2_M.jpg',
                characteristics: [
                    { label: 'Formato', value: 'A4' },
                    { label: 'Páginas', value: '160' },
                    { label: 'Impressão miolo', value: '4/4 cores' },
                    { label: 'Papel miolo', value: 'Ior 100gr' },
                    { label: 'Capa', value: '2 badanas integrais' },
                    { label: 'Impressão capa', value: '4/4 cores + plastificação' },
                    { label: 'Papel capa', value: 'Cromo v/ branco 280gr' },
                    { label: 'Acabamento', value: 'Cosido e brochado' }
                ]
            },
            {
                id: 'lm6',
                name: 'Diálogos Inter-Culturais Portugal — China',
                description: 'Formato 17x24cm. com 440 páginas impressas a 1/1 cor em papel ior 80gr.\n\nCapa impressa a 4/0 cores + plastificação em cartolina cromo v/ branco 300gr.\nAcabamento: cosido e brochado.',
                image: '/imagens/Livros/Capa_Mole/LivroDialogos_M.jpg',
                characteristics: [
                    { label: 'Formato', value: '17 x 24 cm' },
                    { label: 'Páginas', value: '440' },
                    { label: 'Impressão miolo', value: '1/1 cor' },
                    { label: 'Papel miolo', value: 'Ior 80gr' },
                    { label: 'Impressão capa', value: '4/0 cores + plastificação' },
                    { label: 'Papel capa', value: 'Cromo v/ branco 300gr' },
                    { label: 'Acabamento', value: 'Cosido e brochado' }
                ]
            },
            {
                id: 'lm7',
                name: 'Rotas a Oriente',
                description: 'Revista no formato 17x24cm. com 256 páginas.\n\n240 páginas impressas a 2/2 cores + 16 páginas impressas a 4/4 cores, em papel ior 80gr.\n\nCapa impressa a 2/0 cores + plastificação mate em cartolina cromo v/ branco 300gr.\nAcabamento: cosidos e brochados.',
                image: '/imagens/Livros/Capa_Mole/RotasDoOriente_M.jpg',
                characteristics: [
                    { label: 'Formato', value: '17 x 24 cm' },
                    { label: 'Páginas totais', value: '256' },
                    { label: 'Impressão miolo', value: '240p a 2/2 + 16p a 4/4 cores' },
                    { label: 'Papel miolo', value: 'Ior 80gr' },
                    { label: 'Impressão capa', value: '2/0 cores' },
                    { label: 'Plastificação', value: 'Mate' },
                    { label: 'Papel capa', value: 'Cromo v/ branco 300gr' },
                    { label: 'Acabamento', value: 'Cosidos e brochados' }
                ]
            },
            {
                id: 'lm8',
                name: 'Obras Portuguesas em Macau e Sentimentos Orientais',
                description: 'Formato 17x24cm. com 128 páginas impressas a 4/4 cores em papel Ior 135gr.\n\nCapa impressa a 4/0 cores + plastificação em cartolina cromo v/ branco 300gr.\nAcabamento: cosidos e brochados.',
                image: '/imagens/Livros/Capa_Mole/ArteEPoesia_M.jpg',
                characteristics: [
                    { label: 'Formato', value: '17 x 24 cm' },
                    { label: 'Páginas', value: '128' },
                    { label: 'Impressão miolo', value: '4/4 cores' },
                    { label: 'Papel miolo', value: 'Ior 135gr' },
                    { label: 'Impressão capa', value: '4/0 cores + plastificação' },
                    { label: 'Papel capa', value: 'Cromo v/ branco 300gr' },
                    { label: 'Acabamento', value: 'Cosidos e brochados' }
                ]
            },
            {
                id: 'lm9',
                name: 'Livro Agora',
                description: 'Livro de capa mole com acabamento profissional.',
                image: '/imagens/Livros/Capa_Mole/Livro_Agora_M.jpg',
                characteristics: [
                    { label: 'Encadernação', value: 'Capa Mole' },
                    { label: 'Acabamento', value: 'Brochura' }
                ]
            },
            {
                id: 'lm10',
                name: 'Diálogos (Resumos)',
                description: 'Livro de capa mole com acabamento profissional.',
                image: '/imagens/Livros/Capa_Mole/Livro_Dialogos_resumo_M.jpg',
                characteristics: [
                    { label: 'Encadernação', value: 'Capa Mole' },
                    { label: 'Acabamento', value: 'Brochura' }
                ]
            }
        ],
        'livros-capa-dura': [
            {
                id: 'ld1',
                name: 'Gramática da Língua Chinesa',
                description: 'Livro de capa dura com encadernação premium. Qualidade superior para obras de referência e publicações de prestígio.',
                image: '/imagens/Livros/Capa_Dura/GramaticaLinguaChinesa_D.jpg',
                characteristics: [
                    { label: 'Encadernação', value: 'Capa Dura' },
                    { label: 'Acabamento', value: 'Premium' }
                ]
            },
            {
                id: 'ld2',
                name: 'GPS da Vida Cristã',
                description: 'Formato 9x14cm. com 200 páginas impressas a 2/2 cores em papel Munken Pure 90gr.\n\nGuardas sem impressão em Munken Pure 150gr.\nCapa dura com gravação a seco.\nAcabamento: cosido e cartonado.',
                image: '/imagens/Livros/Capa_Dura/Livro_GPS_D.jpg',
                characteristics: [
                    { label: 'Formato', value: '9 x 14 cm' },
                    { label: 'Páginas', value: '200' },
                    { label: 'Impressão miolo', value: '2/2 cores' },
                    { label: 'Papel miolo', value: 'Munken Pure 90gr' },
                    { label: 'Guardas', value: 'Munken Pure 150gr (sem impressão)' },
                    { label: 'Capa', value: 'Dura com gravação a seco' },
                    { label: 'Acabamento', value: 'Cosido e cartonado' }
                ]
            },
            {
                id: 'ld3',
                name: 'O Arquivo da Venerável Ordem Terceira de São Francisco do Porto',
                description: 'Formato 23x29cm. com 204 páginas impressas a 4/4 cores + verniz proteção em couché 135gr.\n\nGuardas impressas a 4/4 cores em couché 200gr.\nCapa dura cartão 2,5mm com plano impresso a 4/0 cores + plastificação.\nAcabamento: cosido e cartonado, lombo redondo, transfil e fitilho. Embalados individualmente em plástico.',
                image: '/imagens/Livros/Capa_Dura/Livro_Ordem_D.jpg',
                characteristics: [
                    { label: 'Formato', value: '23 x 29 cm' },
                    { label: 'Páginas', value: '204' },
                    { label: 'Impressão miolo', value: '4/4 cores + verniz' },
                    { label: 'Papel miolo', value: 'Couché 135gr' },
                    { label: 'Guardas', value: 'Couché 200gr, 4/4 cores' },
                    { label: 'Capa', value: 'Dura cartão 2,5mm + plastificação' },
                    { label: 'Acabamento', value: 'Cosido e cartonado, lombo redondo' },
                    { label: 'Extras', value: 'Transfil, fitilho, embalagem individual' }
                ]
            },
            {
                id: 'ld4',
                name: 'GPS Peregrino',
                description: 'Formato 9x14cm. com 200 páginas impressas a 2/2 cores em papel Munken Pure 90gr.\n\nGuardas sem impressão em Munken Pure 150gr.\nCapa dura com gravação a seco.\nAcabamento: cosido e cartonado.',
                image: '/imagens/Livros/Capa_Dura/Livro_GPS_Peregrino_D.jpg',
                characteristics: [
                    { label: 'Formato', value: '9 x 14 cm' },
                    { label: 'Páginas', value: '200' },
                    { label: 'Impressão miolo', value: '2/2 cores' },
                    { label: 'Papel miolo', value: 'Munken Pure 90gr' },
                    { label: 'Guardas', value: 'Munken Pure 150gr (sem impressão)' },
                    { label: 'Capa', value: 'Dura com gravação a seco' },
                    { label: 'Acabamento', value: 'Cosido e cartonado' }
                ]
            }
        ]
    },

    // ================================================================
    // CALENDÁRIOS DE PAREDE
    // ================================================================
    'calendarios': {
        'calendarios-3-macetes': [
            {
                id: 'cal3',
                name: 'Calendário de Parede 3 Macetes',
                description: 'Base no formato 34,5x79,5cm., impressa a 4/0 cores + verniz proteção + cortante especial + ilhó em cartolina v/ branco 350gr.\n\n3 macetes de calendário mensal formato 32,5x15,5cm, com 12 folhas impressas a 2/0 cores em papel ior 90gr., colados no topo.\n\nAcabamento final: colagem dos 3 macetes na base, colocação de ilhó, colocação de marcador e dobra.',
                image: '/imagens/Calendarios/3M/MockUpCalendario3M.jpg',
                characteristics: [
                    { label: 'Base', value: '34,5 x 79,5 cm' },
                    { label: 'Nº de Macetes', value: '3' },
                    { label: 'Formato macete', value: '32,5 x 15,5 cm' },
                    { label: 'Folhas por macete', value: '12' },
                    { label: 'Papel base', value: 'Cartolina branco 350gr' },
                    { label: 'Papel macetes', value: 'Ior 90gr' },
                    { label: 'Impressão base', value: '4/0 cores + verniz' },
                    { label: 'Impressão macetes', value: '2/0 cores' }
                ]
            }
        ],
        'calendarios-4-macetes': [
            {
                id: 'cal4a',
                name: 'Calendário de Parede 4 Macetes',
                description: 'Base no formato 34,5x99,5cm., impressa a 4/0 cores + verniz proteção + cortante especial + ilhó em cartolina v/ branco 350gr.\n\n4 macetes de calendário mensal formato 32,5x15,5cm, com 12 folhas impressas a 2/0 cores em papel ior 90gr., colados no topo.\n\nAcabamento final: colagem dos 4 macetes na base, colocação de ilhó, colocação de marcador e dobra.',
                image: '/imagens/Calendarios/4M/MockUpCalendario4M.jpg',
                characteristics: [
                    { label: 'Base', value: '34,5 x 99,5 cm' },
                    { label: 'Nº de Macetes', value: '4' },
                    { label: 'Formato macete', value: '32,5 x 15,5 cm' },
                    { label: 'Folhas por macete', value: '12' },
                    { label: 'Papel base', value: 'Cartolina branco 350gr' },
                    { label: 'Papel macetes', value: 'Ior 90gr' },
                    { label: 'Impressão base', value: '4/0 cores + verniz' },
                    { label: 'Impressão macetes', value: '2/0 cores' }
                ]
            },
            {
                id: 'cal4b',
                name: 'Calendário Grupolis 4 Macetes',
                description: 'Calendário de parede 4 macetes personalizado.',
                images: [
                    { src: '/imagens/Calendarios/4M/Calendario_Grupolis_2_4M.jpg', label: 'Fechado' },
                    { src: '/imagens/Calendarios/4M/Calendario_Grupolis_2_Aberto_4M.jpg', label: 'Aberto' }
                ],
                characteristics: [
                    { label: 'Nº de Macetes', value: '4' }
                ]
            }
        ]
    },

    // ================================================================
    // EMBALAGENS
    // ================================================================
    'embalagens': {
        'embalagens-micro-canelado': [
            {
                id: 'mc1',
                name: 'Embalagem Way Up',
                description: 'Formato 130x220x185mm. Micro canelado, fundo automático.',
                image: '/imagens/Embalagens/Micro_Canelado_MC/Embalagem_WAYUP_MC_1.jpg',
                characteristics: [
                    { label: 'Formato', value: '130 x 220 x 185 mm' },
                    { label: 'Material', value: 'Micro canelado' },
                    { label: 'Fundo', value: 'Automático' }
                ]
            },
            {
                id: 'mc2',
                name: 'Embalagem Sport',
                description: 'Formato 148x193x100mm. Micro canelado.',
                image: '/imagens/Embalagens/Micro_Canelado_MC/Embalagem_Sport_MC_2.jpg',
                characteristics: [
                    { label: 'Formato', value: '148 x 193 x 100 mm' },
                    { label: 'Material', value: 'Micro canelado' }
                ]
            },
            {
                id: 'mc3',
                name: 'Embalagem Kefood',
                description: 'Formato 127x285x150mm. Micro canelado, fundo automático.',
                image: '/imagens/Embalagens/Micro_Canelado_MC/Embalagem_Kefood_MC_3.jpg',
                characteristics: [
                    { label: 'Formato', value: '127 x 285 x 150 mm' },
                    { label: 'Material', value: 'Micro canelado' },
                    { label: 'Fundo', value: 'Automático' }
                ]
            },
            {
                id: 'mc4',
                name: 'Embalagem Redo',
                description: 'Formato 160x137x60mm. Mini micro canelado.',
                images: [
                    { src: '/imagens/Embalagens/Micro_Canelado_MC/Embalagem_REDO_MC_4_Aberta.jpg', label: 'Aberta' },
                    { src: '/imagens/Embalagens/Micro_Canelado_MC/Embalagem_REDO_MC_4_Fechada.jpg', label: 'Fechada' }
                ],
                characteristics: [
                    { label: 'Formato', value: '160 x 137 x 60 mm' },
                    { label: 'Material', value: 'Mini micro canelado' }
                ]
            },
            {
                id: 'mc5',
                name: 'Embalagem Way Up Snack Proteico',
                description: 'Formato 125x287x150mm. Micro canelado, fundo automático.',
                image: '/imagens/Embalagens/Micro_Canelado_MC/Embalagem_WAYUP(proteico)_MC_5.jpg',
                characteristics: [
                    { label: 'Formato', value: '125 x 287 x 150 mm' },
                    { label: 'Material', value: 'Micro canelado' },
                    { label: 'Fundo', value: 'Automático' }
                ]
            }
        ],
        'embalagens-cartolina': [
            {
                id: 'ct1',
                name: 'Caixa Celeiro',
                description: 'Formato 80x55x145mm. Cartolina 380gr.',
                images: [
                    { src: '/imagens/Embalagens/Cartolina/Cartolina_Celeiro_1_Aberta.jpg', label: 'Aberta' },
                    { src: '/imagens/Embalagens/Cartolina/Cartolina_Celeiro_1_Fechada.jpg', label: 'Fechada' }
                ],
                characteristics: [
                    { label: 'Formato', value: '80 x 55 x 145 mm' },
                    { label: 'Material', value: 'Cartolina 380gr' }
                ]
            },
            {
                id: 'ct2',
                name: 'Caixa Sun Booster',
                description: 'Formato 70x70x137mm. Cartolina 380gr., fundo automático.',
                image: '/imagens/Embalagens/Cartolina/Cartolina_SUNBOOSTER_2.jpg',
                characteristics: [
                    { label: 'Formato', value: '70 x 70 x 137 mm' },
                    { label: 'Material', value: 'Cartolina 380gr' },
                    { label: 'Fundo', value: 'Automático' }
                ]
            },
            {
                id: 'ct3',
                name: 'Caixa Ptit Truc',
                description: 'Caixa impressa a 4/0 cores em cartolina com plastificação alimentar no interior.',
                image: '/imagens/Embalagens/Cartolina/Cartolina_PTITTRUC_3_Fechada.jpg',
                characteristics: [
                    { label: 'Impressão', value: '4/0 cores' },
                    { label: 'Interior', value: 'Plastificação alimentar' }
                ]
            }
        ]
    },

    // ================================================================
    // ROTULAGEM
    // ================================================================
    'rotulagem': {
        'rotulos': [
            // Adicionar rótulos aqui quando houver informação disponível
        ]
    },

    // ================================================================
    // OUTROS
    // ================================================================
    'outros': {
        'outros-brochuras': [
            {
                id: 'bro1',
                name: 'Brochura Nutribullet',
                description: 'Formato 10x20cm. com 20 páginas.',
                image: '/imagens/Outros/Brochuras/Brochura_nutribullet_1.png',
                characteristics: [
                    { label: 'Formato', value: '10 x 20 cm' },
                    { label: 'Páginas', value: '20' }
                ]
            },
            {
                id: 'bro2',
                name: 'Brochura Kenwood',
                description: 'Formato 10x20cm. com 12 páginas em couché 150gr. + capa.\n\nImpressas a 4/4 cores + verniz proteção.\nAcabamento: agrafadas a 2 pontos.',
                image: '/imagens/Outros/Brochuras/Brochura_Kenwood_1.png',
                characteristics: [
                    { label: 'Formato', value: '10 x 20 cm' },
                    { label: 'Páginas', value: '12' },
                    { label: 'Papel', value: 'Couché 150gr' },
                    { label: 'Impressão', value: '4/4 cores + verniz' },
                    { label: 'Acabamento', value: 'Agrafadas a 2 pontos' }
                ]
            }
        ],
        'outros-postais': [
            {
                id: 'pos1',
                name: 'Postal Duotone',
                description: 'Postais duotone, formato 105x150mm.\n\nPlano total 64,3x15cm., impressos a 2/1 cores + verniz UV geral frente, em cartolina cromo v/ branco 260gr.\nAplicação de vincos e dobra manual.',
                images: [
                    { src: '/imagens/Outros/Postais/Postal_Ordem_2_Aberto.jpg', label: 'Aberto' },
                    { src: '/imagens/Outros/Postais/Postal_Ordem_2_Fechado.jpg', label: 'Fechado' }
                ],
                characteristics: [
                    { label: 'Formato', value: '105 x 150 mm' },
                    { label: 'Plano total', value: '64,3 x 15 cm' },
                    { label: 'Impressão', value: '2/1 cores + verniz UV frente' },
                    { label: 'Papel', value: 'Cromo v/ branco 260gr' },
                    { label: 'Acabamento', value: 'Vincos e dobra manual' }
                ]
            },
            {
                id: 'pos2',
                name: 'Postal a Cores',
                description: 'Postais a cores, formato 105x150mm.\n\nPlano total 129,6x15cm. (2 planos fto. 64,3x15cm colados com fita dupla face), impressos a 4/1 cor + verniz UV mate geral, em cartolina cromo v/ branco 260gr.\nAplicação de vincos, fita cola duas faces e dobra manual.',
                images: [
                    { src: '/imagens/Outros/Postais/Postal_Ordem_1_Fechado.jpg', label: 'Fechado' },
                    { src: '/imagens/Outros/Postais/Postal_Ordem_1_Aberto.jpg', label: 'Aberto' }
                ],
                characteristics: [
                    { label: 'Formato', value: '105 x 150 mm' },
                    { label: 'Plano total', value: '129,6 x 15 cm' },
                    { label: 'Impressão', value: '4/1 cor + verniz UV mate' },
                    { label: 'Papel', value: 'Cromo v/ branco 260gr' },
                    { label: 'Acabamento', value: 'Vincos, fita dupla face e dobra manual' }
                ]
            }
        ],
        'outros-calendarios-secretaria': [
            {
                id: 'csec1',
                name: 'Calendário de Secretária JMV 2025',
                description: 'Formato 12x16cm.\nIMPRESSÃO ESTOCÁSTICA.\n\n12 folhas impressas a 4/4 cores + verniz proteção em couché mate 250gr.\n1 folha impressa a 4/4 cores + verniz proteção em couché mate 350gr.\nBase formato aberto 46x12cm., impressa a 1/0 cor em cartolina cromo v/ branco 400gr.\n\nAcabamento: espiral metálica.',
                images: [
                    { src: '/imagens/Outros/Calendarios_Secretaria/Calendario_De_Secretaria_JMV_1_Aberto.jpg', label: 'Aberto' },
                    { src: '/imagens/Outros/Calendarios_Secretaria/Calendario_De_Secretaria_JMV_1_Fechado.jpg', label: 'Fechado' }
                ],
                characteristics: [
                    { label: 'Formato', value: '12 x 16 cm' },
                    { label: 'Folhas mensais', value: '12' },
                    { label: 'Papel folhas', value: 'Couché mate 250gr' },
                    { label: 'Folha separadora', value: 'Couché mate 350gr' },
                    { label: 'Base aberta', value: '46 x 12 cm, cromo 400gr' },
                    { label: 'Impressão', value: '4/4 cores + verniz' },
                    { label: 'Acabamento', value: 'Espiral metálica' }
                ]
            }
        ],
        'outros-embalagens-redondas': [
            {
                id: 'emr1',
                name: 'Embalagem Redonda',
                description: 'Embalagem em tubo "Collagen Lemon".\n\nFormato 9,5x17cm.',
                image: '/imagens/Outros/Embalagens_Redondas/Embalagem_Redonda_1.jpg',
                characteristics: [
                    { label: 'Formato', value: '9,5 x 17 cm' },
                    { label: 'Forma', value: 'Tubo redondo' }
                ]
            }
        ]
    }
};

/**
 * Obter produtos por categoria e subcategoria.
 * @param {string} categoryId
 * @param {string} subcategoryId
 * @returns {Array}
 */
export function getProducts(categoryId, subcategoryId) {
    const categoryData = PRODUCTS[categoryId];
    if (!categoryData) return [];
    if (!Array.isArray(categoryData)) return categoryData[subcategoryId] || [];
    return categoryData;
}

export default PRODUCTS;
