import { memo } from 'react';
import { motion } from 'framer-motion';

// ─── Folder icon ──────────────────────────────────────────────────────────────

const FOLDER_PATH = 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z';

export const FolderIcon = ({ className = 'folder-icon' }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        <path d={FOLDER_PATH} />
    </svg>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

export const EmptyState = memo(function EmptyState({ subcategory }) {
    return (
        <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <FolderIcon className="empty-state-icon" />
            <p className="empty-state-text">
                {subcategory
                    ? `Ainda não existem trabalhos em "${subcategory.name}".`
                    : 'Selecione um tipo de produto.'}
            </p>
        </motion.div>
    );
});
