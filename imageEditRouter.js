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





module.exports = router    