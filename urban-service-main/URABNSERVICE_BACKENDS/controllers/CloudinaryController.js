// const cloudinary =  require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: "dg4kckjhk",
//     api_key: "724522852387522",
//     api_secret: "BSbinEY2b0Jg64BETqyo5U9MoRk",
//   });
  
//   const uploadFile = async (fileBuffer) => {
//     try {
//       const result = await cloudinary.uploader.upload_stream(
//         { resource_type: "auto" },
//         (error, result) => {
//           if (error) throw error;
//           return result;
//         }
//       ).end(fileBuffer);
//       return result;
//     } catch (error) {
//       console.error("Cloudinary Upload Error:", error);
//       throw new Error("File upload failed");
//     }
//   };


// module.exports = {
//     uploadFile
// }