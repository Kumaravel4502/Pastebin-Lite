// In-memory storage for pastes
const pasteStore = new Map();

export class PasteStore {
    static create(pasteData) {
        const paste = {
            _id: pasteData._id,
            content: pasteData.content,
            createdAt: pasteData.createdAt,
            expiresAt: pasteData.expiresAt,
            maxViews: pasteData.maxViews,
            viewCount: pasteData.viewCount || 0
        };
        pasteStore.set(paste._id, paste);
        return paste;
    }

    static findById(id) {
        return pasteStore.get(id) || null;
    }

    static findByIdAndUpdate(id, query, update, options = {}) {
        const paste = pasteStore.get(id);
        if (!paste) return null;

        // Extract now from query (for TEST_MODE support)
        let now = new Date();
        if (query.$and?.[0]?.$or?.[1]?.expiresAt?.$gt) {
            now = query.$and[0].$or[1].expiresAt.$gt;
        }

        // Check expiry - paste is unavailable if expired
        if (paste.expiresAt && paste.expiresAt <= now) {
            return null;
        }

        // Check max views - paste is unavailable if view limit reached
        if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
            return null;
        }

        // Apply update (increment view count)
        if (update.$inc && update.$inc.viewCount) {
            paste.viewCount += update.$inc.viewCount;
        }

        // Check again after increment
        if (paste.maxViews !== null && paste.viewCount > paste.maxViews) {
            return null;
        }

        pasteStore.set(id, paste);
        return options.new ? paste : null;
    }

    static delete(id) {
        return pasteStore.delete(id);
    }

    static clear() {
        pasteStore.clear();
    }

    static size() {
        return pasteStore.size;
    }
}

export default PasteStore;

