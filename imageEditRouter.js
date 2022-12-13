const router = require('express').Router();
const AWS = require('aws-sdk');
 
AWS.config.loadFromPath(__dirname + "/config/awsconfig.json");
 
// S3 객체 얻기
const s3 = new AWS.S3();

const BUCKET_NAME = 'bucket-sunu';
 
//* 버켓의 객체 리스트 출력

console.log("imageEditRouter 접속")

router.get('/*', (req, res) => {
    const {pathname} = url.parse(req.url, true)
    res.redirect(`https://${BUCKET_URL}${pathname}`)
})


router.post('/', function(req, res) {
    const objectParams_del = {
        Bucket: BUCKET_NAME,
        Key: `639435f18333d6a94d91271e/ine.jpg`,
     };
    s3
        .deleteObject(objectParams_del)
        .promise()
        .then((data) => {
            console.log('success : ', data);
        })
        .catch((error) => {
            console.error(error);
        });
})


module.exports = router    