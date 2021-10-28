var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");

const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

var s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "comicker-comic-panels",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, req.body.s3Key);
    },
  }),
});

exports.upload = upload;
