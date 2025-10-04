// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "uploads/company-logos/");
//     },
//     filename: function(req, file, cb) {
//         const newFileName = "CompanyName-" + Math.round(Math.random() * 1E9) + "-" + Date.now() + path.extname(file.originalname);
//         cb(null, newFileName);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith("image/")) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only image files are allowed!"), false);
//     }
// };

// const upload = multer({ storage, fileFilter, limits: {
//     fileSize: 5 * 1024 * 1024
// }});

// module.exports = upload;







const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.fieldname === "companyLogo") {
            cb(null, "uploads/company-logos/");
        } else if (file.fieldname === "profileImage") {
            cb(null, "uploads/profile-images/");
        } else {
            cb(null, "uploads/");
        }
    },
    filename: function(req, file, cb) {
        if(file.fieldname === "companyLogo") {
            const companyName = req.body.companyName || "Company";
            const newFileName = companyName + "-" + Math.round(Math.random() * 1E9) + "-" + Date.now() + path.extname(file.originalname);
            cb(null, newFileName);
        } else if(file.fieldname === "profileImage") {
            const newFileName = "profileImage-" + Math.round(Math.random() * 1E9) + "-" + Date.now() + path.extname(file.originalname);
            cb(null, newFileName);
        } else {
            const newFileName = "file-" + Math.round(Math.random() * 1E9) + "-" + Date.now() + path.extname(file.originalname);
            cb(null, newFileName);
        }
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter, limits: {
    fileSize: 5 * 1024 * 1024
}});

module.exports = upload;