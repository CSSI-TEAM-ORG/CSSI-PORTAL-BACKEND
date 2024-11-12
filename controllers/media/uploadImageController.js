import Supabase from '../../configs/supabaseClient.js';
import { decode } from "base64-arraybuffer";

const uploadImageController = async (req, res) => {

    try {
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: "Please upload a file" });
            return;
        }

        const fileBase64 = decode(file.buffer.toString("base64"));

        const { data, error } = await Supabase.storage
            .from("images")
            .upload(file.originalname, fileBase64, {
                contentType: "image/png",
            });

        if (error) {
            throw error;
        }

        const { data: image } = Supabase.storage
            .from("images")
            .getPublicUrl(data.path);

        res.status(200).json({ image: image.publicUrl });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export { uploadImageController }