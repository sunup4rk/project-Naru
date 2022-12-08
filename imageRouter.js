const router = require('express').Router();
const url = require('url');
const AWS = require('aws-sdk');
const multiparty = require('multiparty');
const sharp = require('sharp');

const BUCKET_NAME = 'bucket-sunu';
const BUCKET_URL = 'bucket-sunu.s3.ap-northeast-2.amazonaws.com';
AWS.config.loadFromPath(__dirname + "/config/awsconfig.json");

router.get('/*', (req, res) => {
    const {pathname} = url.parse(req.url, true)
    res.redirect(`https://${BUCKET_URL}${pathname}`)
})

router.post('/', function(req, res) {
    const form = new multiparty.Form()
    // 에러 처리
    form.on('error', function(err){
        res.status(500).end()
    })
    // form 데이터 처리
    form.on('part', function(part){
        if(!part.filename)
            return part.resume()

        const filename = part.filename
        const processFunctions = [makeSmallImage, makeMiddleImage, makeThumbnail]
        // 두 함수중 한 가지 택 1할 수 있습니다.
        //streamToBuffer(part, filename)
        streamToBufferUpload(part, filename)
            .then( image => processImage(image, filename, processFunctions) )
            .then( ( ) => { /* 이미지 프로세스가 모두 처리된 후 실행할 내용 */})

    })
    // form 종료
    form.on('close', function(){
        res.end()
    })
    form.parse(req)
})

function uploadToBucket(filename, Body){
    const params = { Bucket:BUCKET_NAME, Key:filename, Body, ContentType: 'image' }
    const upload = new AWS.S3.ManagedUpload({ params });
    return upload.promise()
}

function streamToBuffer(part, filename){
    const chunks = [];
    return new Promise((resolve, reject) => {
        part.on('data',   (chunk) => chunks.push(Buffer.from(chunk)));
        part.on('error',  ( err ) => reject(err));
        part.on('end',    (     ) => resolve(Buffer.concat(chunks)));
        part.resume()
    })
}

function streamToBufferUpload(part, filename){
    const chunks = [];
    return new Promise((resolve, reject) => {
        part.on('data',   (chunk) => chunks.push(Buffer.from(chunk)));
        part.on('error',  ( err ) => reject(err));
        part.on('end',    (     ) => resolve(Buffer.concat(chunks)));
        uploadToBucket(filename, part)
    })
}
function processImage(image, filename, functions=[]){
    if(!functions.length) return
    const promiseList = functions.map( item => item(image, filename))
    return Promise.all(promiseList)
}


function makeMiddleImage(data, filename){
    // const Image =
    // sharp(data, {failOnError:false})
    //     .withMetadata()
    //     .resize(640)
    //     .jpeg({mozjpeg:true})

    // return uploadToBucket('middle/'+filename, Image)
}
function makeSmallImage(data, filename){
    const Image =
    sharp(data, {failOnError:false})
        .withMetadata()
        .resize(309)
        .jpeg({mozjpeg:true})

    return uploadToBucket('small/'+filename, Image)
}
function makeThumbnail(data, filename){
    const Image =
    sharp(data, {failOnError:false})
        .withMetadata()
        .resize(103,103)
        .jpeg({mozjpeg:true})

    return uploadToBucket('thumb/'+filename, Image)
}
module.exports = router