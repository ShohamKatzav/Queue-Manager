import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.KEY,
    api_secret: process.env.SECRET
});

const uploadToCloudinary = async (path: string, folder = "users-images") => {
    try {
        const data = await cloudinary.uploader.upload(path, { folder: folder });
        return { url: data.secure_url, publicId: data.public_id };
    } catch (err) {
        console.log(err);
        throw err;
    }
};
export default uploadToCloudinary;