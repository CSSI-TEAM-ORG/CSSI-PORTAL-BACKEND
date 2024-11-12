import multer from 'multer';

const checkSingleFileUpload = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    }
    next(err);
}

export { checkSingleFileUpload };
