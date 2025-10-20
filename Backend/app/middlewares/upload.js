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







// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         if(file.fieldname === "companyLogo") {
//             cb(null, "uploads/company-logos/");
//         } else if (file.fieldname === "profileImage") {
//             cb(null, "uploads/profile-images/");
//         } else {
//             cb(null, "uploads/");
//         }
//     },
//     filename: function(req, file, cb) {
//         if(file.fieldname === "companyLogo") {
//             const companyName = req.body.companyName || "Company";
//             const newFileName = companyName + "-" + Math.round(Math.random() * 1E9) + "-" + Date.now() + path.extname(file.originalname);
//             cb(null, newFileName);
//         } else if(file.fieldname === "profileImage") {
//             const newFileName = "profileImage-" + Math.round(Math.random() * 1E9) + "-" + Date.now() + path.extname(file.originalname);
//             cb(null, newFileName);
//         } else {
//             const newFileName = "file-" + Math.round(Math.random() * 1E9) + "-" + Date.now() + path.extname(file.originalname);
//             cb(null, newFileName);
//         }
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

// Configure storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname === "companyLogo" || file.fieldname === "logo") {
            cb(null, "uploads/company-logos/");
        } else if (file.fieldname === "profileImage" || file.fieldname === "profile") {
            cb(null, "uploads/profile-images/");
        } else if (file.fieldname === "resume" || file.fieldname === "resumePath" || file.fieldname === "resumeFile") {
            cb(null, "uploads/resumes/");
        } else {
            cb(null, "uploads/");
        }
    },
    filename: function(req, file, cb) {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        
        if (file.fieldname === "companyLogo" || file.fieldname === "logo") {
            const companyName = req.body.companyName || "Company";
            const newFileName = `company-${companyName}-${random}-${timestamp}${path.extname(file.originalname)}`;
            cb(null, newFileName);
        } else if (file.fieldname === "profileImage" || file.fieldname === "profile") {
            const newFileName = `profile-${random}-${timestamp}${path.extname(file.originalname)}`;
            cb(null, newFileName);
        } else if (file.fieldname === "resume" || file.fieldname === "resumePath" || file.fieldname === "resumeFile") {
            const userName = req.userId || "user";
            const newFileName = `resume-${userName}-${random}-${timestamp}${path.extname(file.originalname)}`;
            cb(null, newFileName);
        } else {
            const newFileName = `file-${random}-${timestamp}${path.extname(file.originalname)}`;
            cb(null, newFileName);
        }
    }
});

const fileFilter = (req, file, cb) => {
    // Allow images for companyLogo and profileImage
    if (file.fieldname === "companyLogo" || file.fieldname === "logo" || 
        file.fieldname === "profileImage" || file.fieldname === "profile") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed for profile images and company logos!"), false);
        }
    }
    // Allow PDFs for resumes
    else if (file.fieldname === "resume" || file.fieldname === "resumePath" || file.fieldname === "resumeFile") {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed for resumes!"), false);
        }
    }
    // Default case
    else {
        cb(new Error(`Unexpected field: ${file.fieldname}`), false);
    }
};

// Create upload middleware instances
const uploadImages = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadResumes = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed for resumes!"), false);
        }
    }, 
    limits: { fileSize: 10 * 1024 * 1024 }
});

// For single file uploads with specific field names
const uploadSingleImage = (fieldName) => {
    return multer({
        storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("Only image files are allowed!"), false);
            }
        },
        limits: { fileSize: 10 * 1024 * 1024 }
    }).single(fieldName);
};

module.exports = {
    uploadImages,
    uploadResumes,
    uploadSingleImage
};