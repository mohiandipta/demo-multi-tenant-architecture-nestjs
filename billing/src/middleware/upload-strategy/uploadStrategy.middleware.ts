import multer from 'multer'

export const inMemoryStorage = multer.memoryStorage(),
    uploadStrategy = multer({
        storage: inMemoryStorage,
        limits: { fileSize: 10 * 1024 * 1024 },
    }).fields([
        { name: "media" },
    ]);
