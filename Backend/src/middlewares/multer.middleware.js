import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.startsWith("image/") ||
            file.mimetype === "application/pdf" ||
            file.mimetype === "text/plain" ||
            file.mimetype === "application/msword" ||
            file.mimetype ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only images, PDFs, TXT, and Word files are allowed!"
                ),
                false
            );
        }
    },
});

export default upload;
