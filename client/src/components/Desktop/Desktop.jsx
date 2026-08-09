import { memo } from 'react';
import { motion } from 'framer-motion';

import SmartImage from '../SmartImage';

const TAGLINE = 'Fique com boa impressão nossa';

const Desktop = memo(function Desktop() {
    return (
        <main className="desktop">
            {/* O <h1> é o título real da página. Fica visualmente oculto porque a
                identidade é transmitida pelo logótipo, mas dá à página uma
                estrutura navegável e um sinal correto para os motores de busca. */}
            <h1 className="visually-hidden">
                Clássica Artes Gráficas — impressão de livros, catálogos, embalagens, rótulos e calendários no Porto
            </h1>

            <motion.div
                className="desktop-logo-wrap"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <SmartImage
                    src="/imagens/Logos/logo_white.jpg"
                    alt="Clássica Artes Gráficas"
                    className="desktop-logo"
                    sizes="(max-width: 600px) 70vw, 420px"
                    loading="eager"
                    fetchPriority="high"
                    draggable={false}
                />
            </motion.div>

            <motion.p
                className="desktop-tagline"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            >
                {/* Animação letra a letra, mas com o texto legível como um todo
                    para leitores de ecrã e para quando o movimento é reduzido.

                    O espaçamento entre palavras é feito com `column-gap` no CSS,
                    não com nós de texto: cada palavra é um flex item, e pela
                    especificação do Flexbox um nó de texto só com espaços não
                    gera flex item — era descartado e as palavras colavam-se. */}
                <span className="visually-hidden">{TAGLINE}</span>
                <span className="tagline-text" aria-hidden="true">
                    {TAGLINE.split(' ').map((word, wordIndex, words) => (
                        <span className="tagline-word" key={`${word}-${wordIndex}`}>
                            {word.split('').map((char, i) => (
                                <motion.span
                                    className="tagline-char"
                                    key={`${char}-${i}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: 0.7 + (words.slice(0, wordIndex).join(' ').length + i) * 0.028,
                                        ease: 'easeOut',
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    ))}
                </span>
            </motion.p>

            <motion.span
                className="tagline-line"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 1.7, ease: 'easeInOut' }}
            />
        </main>
    );
});

export default Desktop;
