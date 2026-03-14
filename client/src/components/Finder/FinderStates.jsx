import { memo } from 'react';
import { motion } from 'framer-motion';

// ─── Folder icon ──────────────────────────────────────────────────────────────

export const FolderIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

// ─── Loading state ────────────────────────────────────────────────────────────

export const LoadingState = memo(function LoadingState() {
    return (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="loading-spinner"></div>
            <p className="empty-state-text">A carregar...</p>
        </motion.div>
    );
});

// ─── Empty state ──────────────────────────────────────────────────────────────

export const EmptyState = memo(function EmptyState({ subcategory }) {
    return (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-state-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <p className="empty-state-text">
                {subcategory ? `Ainda não existem produtos em "${subcategory.name}".` : 'Selecione um tipo de produto.'}
            </p>
        </motion.div>
    );
});
