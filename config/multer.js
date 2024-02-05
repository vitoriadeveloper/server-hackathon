const multer = require("multer");
const path = require("path");

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, "uploads/");
        },
        filename: (req, file, callback) => {
            const filename = `${Date.now()}${path.extname(file.originalname)}`;
            console.log("Imagem salva:", filename);
            callback(null, filename);
        },
    }),
    limits: {
        fileSize: 8 * 1024 * 1024, // 8mb
    },
    fileFilter: (req, file, callback) => {
        const mimeType = ["image/png", "image/jpeg", "image/gif", "image/jpg"];
        if (!mimeType.includes(file.mimetype)) {
            return callback(null, false);
        }

        return callback(null, true);
    },
};
const upload = multer(multerConfig);
module.exports = upload;
