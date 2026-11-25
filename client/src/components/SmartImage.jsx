import { useState, useCallback, memo } from 'react';

import { toImageKey, imageEntry, buildSrcSet } from '../utils/images';

/**
 * Imagem responsiva única para todo o site.
 *
 * Recebe o caminho como está escrito em products.js ('/imagens/Pasta/nome.jpg')
 * e resolve, através do manifesto gerado por scripts/optimize-images.mjs:
 *
 *   - AVIF e WebP em várias larguras (srcset + sizes)
 *   - width/height intrínsecos → sem layout shift (CLS)
 *   - fallback visível se o ficheiro faltar, em vez do ícone de imagem quebrada
 *
 * A extensão do caminho original é ignorada de propósito: o proprietário
 * continua a escrever '/imagens/Catalogos/foto.jpg' em products.js sem ter de
 * saber que formatos existem em disco.
 */
const SmartImage = memo(function SmartImage({
    src,
    alt = '',
    sizes = '100vw',
    className,
    loading = 'lazy',
    fetchPriority,
    decoding = 'async',
    draggable,
    onLoad,
    fadeIn = false,
}) {
    const [failed, setFailed] = useState(false);
    // `fadeIn`: a imagem aparece com um fade curto quando chega, em vez de
    // "saltar" para o ecrã. Se já estiver em cache (complete no momento em que
    // o elemento é ligado), fica visível de imediato, sem fade nenhum.
    const [loaded, setLoaded] = useState(false);
    const imgRef = useCallback((node) => {
        if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
    }, []);
    const handleLoad = useCallback((event) => {
        setLoaded(true);
        onLoad?.(event);
    }, [onLoad]);
    const entry = imageEntry(src);

    if (failed || !entry) {
        return (
            <div
                className={`image-fallback ${className || ''}`.trim()}
                style={entry ? { aspectRatio: `${entry.w} / ${entry.h}` } : undefined}
                role="img"
                aria-label={alt || 'Imagem não disponível'}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                </svg>
            </div>
        );
    }

    // Largura intermédia como src base: browsers sem srcset recebem algo razoável.
    const fallbackWidth = entry.s[Math.min(1, entry.s.length - 1)];

    return (
        <picture>
            <source type="image/avif" srcSet={buildSrcSet(src, 'avif')} sizes={sizes} />
            <source type="image/webp" srcSet={buildSrcSet(src, 'webp')} sizes={sizes} />
            <img
                src={`${toImageKey(src)}-${fallbackWidth}.webp`}
                alt={alt}
                width={entry.w}
                height={entry.h}
                ref={fadeIn ? imgRef : undefined}
                className={[className, fadeIn && (loaded ? 'is-loaded' : 'is-loading')].filter(Boolean).join(' ') || undefined}
                loading={loading}
                fetchPriority={fetchPriority}
                decoding={decoding}
                draggable={draggable}
                onLoad={fadeIn ? handleLoad : onLoad}
                onError={() => setFailed(true)}
            />
        </picture>
    );
});

export default SmartImage;
