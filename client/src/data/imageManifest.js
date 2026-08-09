/**
 * GERADO AUTOMATICAMENTE por scripts/optimize-images.mjs — não editar à mão.
 *
 * Chave  = caminho da imagem sem extensão nem sufixo de largura.
 * w / h  = dimensões intrínsecas do original (para width/height e aspect-ratio).
 * s      = larguras disponíveis em disco (AVIF + WebP).
 */
const IMAGE_MANIFEST = {
    "/imagens/Calendarios/3M/MockUpCalendario3M": {
        "w": 1080,
        "h": 623,
        "s": [
            400,
            900,
            1080
        ]
    },
    "/imagens/Calendarios/4M/Calendario_Grupolis_2_4M": {
        "w": 3474,
        "h": 2516,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Calendarios/4M/Calendario_Grupolis_2_Aberto_4M": {
        "w": 624,
        "h": 1632,
        "s": [
            400,
            624
        ]
    },
    "/imagens/Calendarios/4M/MockUpCalendario4M": {
        "w": 1080,
        "h": 695,
        "s": [
            400,
            900,
            1080
        ]
    },
    "/imagens/Catalogos/Catalogo_Frato_1": {
        "w": 880,
        "h": 1168,
        "s": [
            400,
            880
        ]
    },
    "/imagens/Catalogos/Catalogo_Madalena_2": {
        "w": 1200,
        "h": 864,
        "s": [
            400,
            900,
            1200
        ]
    },
    "/imagens/Catalogos/Catalogo_Valadares_3": {
        "w": 1184,
        "h": 880,
        "s": [
            400,
            900,
            1184
        ]
    },
    "/imagens/Embalagens/Cartolina/Cartolina_Celeiro_1_Aberta": {
        "w": 2643,
        "h": 3578,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Cartolina/Cartolina_Celeiro_1_Fechada": {
        "w": 1998,
        "h": 3368,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Cartolina/Cartolina_PTITTRUC_3_Fechada": {
        "w": 3035,
        "h": 2249,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Cartolina/Cartolina_SUNBOOSTER_2": {
        "w": 2296,
        "h": 2871,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Micro_Canelado_MC/Embalagem_Kefood_MC_3": {
        "w": 2724,
        "h": 3134,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Micro_Canelado_MC/Embalagem_REDO_MC_4_Aberta": {
        "w": 3798,
        "h": 2567,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Micro_Canelado_MC/Embalagem_REDO_MC_4_Fechada": {
        "w": 3072,
        "h": 3415,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Micro_Canelado_MC/Embalagem_Sport_MC_2": {
        "w": 3127,
        "h": 2371,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Micro_Canelado_MC/Embalagem_WAYUPproteico_MC_5": {
        "w": 3072,
        "h": 3101,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Embalagens/Micro_Canelado_MC/Embalagem_WAYUP_MC_1": {
        "w": 3033,
        "h": 2885,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Livros/Capa_Dura/GramaticaLinguaChinesa_D": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Livros/Capa_Dura/Livro_GPS_D": {
        "w": 2686,
        "h": 2757,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Livros/Capa_Dura/Livro_GPS_Peregrino_D": {
        "w": 3072,
        "h": 4096,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Livros/Capa_Dura/Livro_Ordem_D": {
        "w": 1168,
        "h": 880,
        "s": [
            400,
            900,
            1168
        ]
    },
    "/imagens/Livros/Capa_Mole/ArteEPoesia_M": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Livros/Capa_Mole/AsCoresDeAbril_M": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Livros/Capa_Mole/GramaticaLinguaChinesa_M": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Livros/Capa_Mole/LivroChines1_M": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Livros/Capa_Mole/LivroChines2_M": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Livros/Capa_Mole/LivroDialogos_M": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Livros/Capa_Mole/Livro_Agora_M": {
        "w": 1072,
        "h": 960,
        "s": [
            400,
            900,
            1072
        ]
    },
    "/imagens/Livros/Capa_Mole/RotasDoOriente_M": {
        "w": 1366,
        "h": 768,
        "s": [
            400,
            900,
            1366
        ]
    },
    "/imagens/Logos/logo_white": {
        "w": 1686,
        "h": 418,
        "s": [
            400,
            900,
            1686
        ]
    },
    "/imagens/Outros/Brochuras/Brochura_Kenwood_1": {
        "w": 784,
        "h": 1296,
        "s": [
            400,
            784
        ]
    },
    "/imagens/Outros/Brochuras/Brochura_nutribullet_1": {
        "w": 848,
        "h": 1216,
        "s": [
            400,
            848
        ]
    },
    "/imagens/Outros/Calendarios_Secretaria/Calendario_De_Secretaria_JMV_1_Aberto": {
        "w": 896,
        "h": 1152,
        "s": [
            400,
            896
        ]
    },
    "/imagens/Outros/Calendarios_Secretaria/Calendario_De_Secretaria_JMV_1_Fechado": {
        "w": 896,
        "h": 1152,
        "s": [
            400,
            896
        ]
    },
    "/imagens/Outros/Calendarios_Secretaria/Calendario_De_Secretaria_JMV_1_Lado": {
        "w": 3072,
        "h": 4096,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Outros/Embalagens_Redondas/Embalagem_Redonda_1": {
        "w": 2464,
        "h": 2972,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Outros/Postais/Postal_Ordem_1_Aberto": {
        "w": 3072,
        "h": 4096,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Outros/Postais/Postal_Ordem_1_Fechado": {
        "w": 4096,
        "h": 3072,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Outros/Postais/Postal_Ordem_2_Aberto": {
        "w": 3072,
        "h": 3514,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Outros/Postais/Postal_Ordem_2_Fechado": {
        "w": 4096,
        "h": 3072,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Rotulos/Rotulo_Nutrimoa_Baunilha": {
        "w": 1628,
        "h": 913,
        "s": [
            400,
            900,
            1628
        ]
    },
    "/imagens/Rotulos/Rotulo_Nutrimoa_Cafe": {
        "w": 1343,
        "h": 763,
        "s": [
            400,
            900,
            1343
        ]
    },
    "/imagens/Rotulos/Rotulo_Nutrimoa_Chocolate": {
        "w": 1227,
        "h": 793,
        "s": [
            400,
            900,
            1227
        ]
    },
    "/imagens/Rotulos/Rotulo_Toskin_Cafe": {
        "w": 1933,
        "h": 896,
        "s": [
            400,
            900,
            1800
        ]
    },
    "/imagens/Rotulos/Rotulo_Toskin_Colageno-frutos-vermelhos": {
        "w": 1910,
        "h": 727,
        "s": [
            400,
            900,
            1800
        ]
    }
};

export default IMAGE_MANIFEST;
