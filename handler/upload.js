const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "amanuel",
  api_key: "514354735915838",
  api_secret: "l6aAwXJXzac6Yp1_uwN9yhQNaak",
});

const upload = async (req, res) => {
  try {
    const { image, folder } = req.body.input;
    // console.log(image);
    // let secure_urls = "";
    // console.log(image);
    // console.log(folder);
    let urls = "";
    let uploaded_images = [];

    for (let i = 0; i < image.length; i++) {
      await cloudinary.uploader
        .upload(image[i], {
          unique_filename: true,
          discard_original_filename: true,
          folder: folder,
          timeout: 120000,
        })
        .then((data) => {
          // changing images to object of Image table for postgresql
          uploaded_images.push({ image_status: "not_cover", path: data.url });
        });
    }

    // secure_urls = data.secure_url;

    // urls = data.url;

    // console.log(urls);

    // console.log(images)

    // success
    console.log("image uploaded!");
    console.log(uploaded_images);
    return res.send(uploaded_images);
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Error Uploading Files",
    });
  }
  //     // let imageBuffer = Buffer.from(base64str, 'base64');

  //     // // upload the file to somewhere( s3 or google Cloud)
  //     // fs.writeFileSync("../../../assets/images/foods" + name, imageBuffer, 'base64')
};

module.exports = upload;
