const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, assetName) => {
    try {
        const handleUpdate = fileBuffer.map((item) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: assetName,
                        use_filename: true,
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                );

                stream.end(item.buffer);
            });
        })
        return await Promise.all(handleUpdate);
    } catch (err) {
        console.error(err);
        throw err
    }
};

const destroyToCloudinary = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId, {resource_type: "image"});
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {uploadToCloudinary, destroyToCloudinary};
