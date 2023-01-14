import express from 'express';
import config from './src/config/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongodb from 'mongodb';
import http from 'http';
import AWS from 'aws-sdk';
import multiparty from 'multiparty'
import methodOverride from 'method-override';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import fileStore from 'session-file-store';
import passport from 'passport';
import passportLocal from 'passport-local';
import moment from 'moment';
import timeZone from 'moment-timezone';
import { Server } from 'socket.io';
import ejs from 'ejs';
import nodemailer from 'nodemailer';

const app = express();

// socket 세팅
const httpServer = http.createServer(app);
const io = new Server(httpServer);


// 미들웨어 설정
app.use(express.json());
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json())

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

var db;
const MongoClient = mongodb.MongoClient;
MongoClient.connect(config.databaseURL, function(err, client) {
    if (err) { return console.log(err) }
    db = client.db('Naru');
    app.db = db;

    httpServer.listen(config.port, function() {
        console.log('listening on', config.port);
    })
})

// AWS 설정
AWS.config.update({
    "accessKeyId": config.AWS_CONFIG.accessKeyId,
    "secretAccessKey": config.AWS_CONFIG.secretAccessKey,
    "region": config.AWS_CONFIG.region
})
const BUCKET_NAME = 'bucket-sunu';
const s3 = new AWS.S3();

app.use(methodOverride('_method'));

// public 폴더의 내용을 정적파일로 사용
app.use('/public', express.static('public'));

 
// 쿠키 미들웨어
app.use(cookieParser());

// 세션 미들웨어
const SessionFileStore = fileStore(session);
app.use(session({
    secret: config.passportSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 3  // 3시간
    },
    store: new SessionFileStore()
}));

// 패스포트 passport 미들웨어
const localStrategy = passportLocal.Strategy;
app.use(passport.initialize());
app.use(passport.session());

// 시간 미들웨어
moment.tz.setDefault("Asia/Seoul");

// ================================= 사용자 레벨 체크 함수 ============================================ //
function LevelCheck(_id) {
    db.collection('user_info').findOne({_id : _id}, function(err, result){
        var lv = 0;
        if(result.user_point <= 1000){
            lv = 1;
        }
        else if(result.user_point > 1000 && result.user_point <= 2000){
            lv = 2;
        }
        else if(result.user_point > 2000 && result.user_point <= 3000){
            lv = 3;
        }
        else if(result.user_point > 3000 && result.user_point <= 4000){
            lv = 4;
        }
        else if(result.user_point > 4000){
            lv = 5;
        }
        db.collection('user_info').updateOne({_id : _id}, {$set : {user_level : lv}})
    })  
}


// ================================= 크롤링 코드 영역 ================================================== //

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

const crawlTime = moment().format('YYYY-MM-DD');

async function CrawlGame () {
        
    const browser = await puppeteer.launch({
        headless: true
    });
    
    console.log("게임 크롤링 실행")
    const page = await browser.newPage()
    await page.goto('https://www.thelog.co.kr/index.do');
    const content = await page.content();
    const $ = cheerio.load(content);

    const lists = $("#game_rank > tr");
    var resultGame = []
    for (var i = 0; i < lists.length; i++){
        resultGame[i] = $(lists[i]).find("tr > td.name").text()
    }

    db.collection('crawling').updateOne(
        {sort : 'game'}, 
        {$set : {
            title : resultGame,
            time : crawlTime,
            }}, function(err, result){
        if(err){
            console.log("크롤링 실패, 대상 웹페이지를 확인해보세요")
        }   
        else{
            console.log('게임순위 데이터 입력 완료')
        }
    })
    browser.close();
}

async function CrawlMovie () {
        
    const browser = await puppeteer.launch({
        headless: true
    });
    console.log("영화 크롤링 실행")
    const page = await browser.newPage();
    await page.goto('https://movie.daum.net/ranking/boxoffice/weekly');
    const content = await page.content();
    const $ = cheerio.load(content);

    const lists = $("#mainContent > div > div.box_boxoffice > ol > li");

    var name;
    var titleimg;

    lists.each((index, lists) => {
        name = $(lists).find("div > div.thumb_cont > strong > a").text();
        titleimg = $(lists).find("div > div.thumb_item > div.poster_movie > img").attr('src')
        db.collection('crawling').updateOne(
            {num : index}, 
            {$set : {
                title : name,
                titleimg : titleimg,
                time : crawlTime,
                }}, function(err, result){
            if(err){
                console.log("크롤링 실패, 대상 웹페이지를 확인해보세요")
            }   
            else{
                console.log(index + 1,'번째 영화순위 데이터 입력 완료')
            }
    
        })
    })
  
    browser.close();
}

function CrawlCheck(){
    db.collection('crawling').findOne({sort : 'time'}, function(err, result){
        if(result.time !== crawlTime){
            console.log('날짜 변경, 크롤링 재실행')
            db.collection('crawling').updateOne(
                { sort: 'time'}, { $set : {time : crawlTime}},
            )
            CrawlMovie()
            CrawlGame()
        }
        else{
            console.log('크롤링 최신 버전 : ', crawlTime)
        }
    })
}

// 크롤링 페이지 요청 API
app.get('/explore/cafe', function(req, res){
    CrawlCheck()
    db.collection('crawling').findOne({sort : 'cafe'}, function(err, result){
        res.send({
            message : "카페",
            result : result.title,
        }); 
    })
})

app.get('/explore/ent', function(req, res){
    CrawlCheck()
    db.collection('crawling').findOne({sort : 'game'}, function(err, result){
        res.send({
            message : "오락",
            result : result.title,
        }); 
    })
})

app.get('/explore/culture', function(req, res){
    CrawlCheck()
    db.collection('crawling').find({
        sort : 'movietest'
    }).sort({
        'num' : 1
    }).toArray(function(err, result){
        res.send({
            message : "영화",
            result : result
        }); 
    })
})

// ================================= 크롤링 끝 ================================================== //


// 커뮤니티 - 전체 글 불러오기
app.get('/community', function(req, res) { 
    db.collection('post').find({writer: {$nin: [""]}}).toArray(function(err, result){
        result.reverse()
        if (err) {
            res.json({message : "전송 실패"})
        }
        else {
            res.status(200).send({
                message : "조회 성공",
                result : result,
                totalpost : result.length
            });         
        }
    });
})

// 페이지 벗어났을 때 빈 게시물 삭제 (커뮤니티 페이지로 이동시)
app.delete('/community', function(req, res){
    if(!req.isAuthenticated()){
        res.json({message : "삭제 완료"})
    }
    else{
        db.collection('post').findOne({user_id : req.user._id, writer : ""}, function(err, result){
            if(result !== null){
                db.collection('post').deleteOne({user_id : result.user_id, writer : ""})
            }
            res.json({message : "삭제 완료"})
        })
    }
})

// ======================================= 검색기능 ===================================================== //

app.get('/search', function(req, res){
    const nullArr = []
    let condition = 
    [
        {
          $search: {
            index: 'postSearch',
            text: {
              query: req.query.value,
              path: {
                'wildcard': '*'
              }
            }
          }
        }
      ]
    db.collection('post').aggregate(condition).toArray(function(err, result){
        if(result.toString() == nullArr.toString()){
            res.json({message : "검색 결과 없음"})
        }
        else{
            res.send({
                message : '검색 성공',
                result : result,
            })
        }
    })
})

// 커뮤니티 - 인기글 로드 코드 
app.get('/best', function(req, res) {
    db.collection('post').find({ 
        'like_count' : { '$gt' : 0 } 
    }).sort({
        'like_count' : -1
    }).limit(3).toArray(function(err, result) {
        if (err) {
            res.json({message : "전송 실패"})
        }
        else{
            res.status(200).send({
                message : "인기글 조회 성공",
                result : result
            });
        }
    });
})

// 커뮤니티 -  상세페이지 - 좋아요 코드
app.post("/community/detail/like/:id", function(req, res) {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        var chk = false
        if (!req.isAuthenticated()) {
            res.json({message : "비회원"})
        }
        else if (result.like_count == 0) {
            db.collection('post').updateOne(
                { _id: parseInt(req.params.id)},
                { $inc : {like_count : 1} , $push: { like_user: req.user._id.toString()}},
                )
            db.collection('user_info').updateOne(
                { _id: req.user._id},
                { $push: { like_post: parseInt(req.params.id)}},
            )
            res.send({
                message : "좋아요",
                like_count : result.like_count,
            }); 
        }
        else {
            for (var i = 0; i <= result.like_count; i++){
                if (result.like_user[i] == req.user._id.toString()) {
                    chk = true
                    break
                }
            }
                if (!chk) {
                    db.collection('post').updateOne(
                        { _id: parseInt(req.params.id)},
                        { $inc : {like_count : 1} , $push: { like_user: req.user._id.toString()}},
                    )
                    db.collection('user_info').updateOne(
                        { _id: req.user._id},
                        { $push: { like_post: parseInt(req.params.id)}},
                    )
                    res.send({
                        message : "좋아요",
                        like_count : result.like_count,
                    }); 
                }
                else {
                    db.collection('post').updateOne(
                        { _id: parseInt(req.params.id)},
                        { $inc : {like_count : -1} , $pull: { like_user: req.user._id.toString()}},
                    )
                    db.collection('user_info').updateOne(
                        { _id: req.user._id},
                        { $pull: { like_post: parseInt(req.params.id)}},
                    )
                    res.send({
                        message : "좋아요",
                        like_count : result.like_count,
                    }); 
                }
            }
        }
    )
})

// 커뮤니티 - 글 작성 페이지 요청 코드
app.get("/community/write", function(req, res) {
    db.collection('post_count').findOne({name : 'postcnt'}, function(err, result) {
        let postId = Number(result.total_post) + 1
        UpdatePostCount();
        db.collection('post').insertOne({
            _id : postId,
            user_id : req.user._id,
            writer : "",
            profile : "",
            post_title : "", 
            post_content : "", 
            like_count : 0,
            like_user : [],
            post_address : "",
            post_address_detail : "",
            image_address : new Array(4),
            post_time : moment().format('YYYY-MM-DD')
            },
            function(err, result) {
                if (err) {
                    res.json({message : "다시 시도해주세요."})
                }
                else {
                    res.json({postId : postId});         
                }
            }
        )
    })
})

// 글 작성 페이지 최종작성 API
app.post("/community/write/", function(req, res) {
    db.collection('post').updateOne(
        {_id: req.body.postId},
        {$set: {
            _id : req.body.postId,
            user_id : req.user._id,
            writer : req.user.nickname,
            profile : req.user.profile_image_path,
            post_title : req.body.title, 
            post_content : req.body.content, 
            like_count : 0, 
            like_user : [],
            post_address : req.body.address,
            post_address_detail : req.body.addressDetail,
            post_time : moment().format('YYYY-MM-DD')
        }}            
        ,
        function (err, result) {
            if (err) {
                res.json({message : "등록 실패"})
            }
            else {
                // console.log("post_id :", postId, " 등록");
                UpdateUserInfo(req.user._id);
                LevelCheck(req.user._id)
                res.status(200).json({message : "등록 성공"});         
            }
        }
    )
})

// 글 작성시 포인트 업데이트
function UpdateUserInfo(_id) {
    db.collection('user_info').updateOne(
        {_id : _id},
        {$inc : {user_point : 30, posting_count : 1}},
        function(err, result) {
            if (err) return console.log(err);
            else {
                console.log("user_point : 업데이트 완료");
                console.log("posting_count : 업데이트 완료");
            } 
        }
    )
}

// 글 작성시 전체 포스트 카운터 수 증가
function UpdatePostCount() {
    db.collection('post_count').updateOne(
        {name : 'postcnt'},
        {$inc :{total_post : 1}},
        function(err, result) {
            if (err) return console.log(err);
            else console.log("total_post : 업데이트 완료");
        }
    )
}

// 게시글 상세 페이지 요청 API
app.get('/community/detail/:id', function(req, res) {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        const postResult = result
        db.collection('user_info').findOne({_id : result.user_id}, function(err, result){
            if (err) { res.json({message : "글 전송 실패"}); }
            if (!req.isAuthenticated()) {
                res.status(200).send({
                    message : "비로그인",
                    postResult : postResult,
                    userResult : result
                }); 
            }
            else if (postResult.user_id.toString() === req.user._id.toString()) {
                res.status(200).send({
                    message : "일치",
                    postResult : postResult,
                    userResult : result
                });         
            }
            else {
                res.status(200).send({
                    message : "불일치",
                    postResult : postResult,
                    userResult : result
                });  
            }
        })
        
    })
})

// 게시글 수정 데이터 요청 API
app.get("/community/edit/:id", function(req, res) {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        if (err) return err;
        res.status(200).send({
            message : "전송",
            result : result
        });         
    });
})

// 게시글 수정 API
app.put('/community/edit/:id', function(req, res) {

    var titlechk = true
    var addresschk = true
    var addressDetailchk = true
    var contentchk = true

    if (req.body.title == ""){
        titlechk = false
    }
    if (req.body.address == ""){
        addresschk = false
    }
    if (req.body.addressDetail == ""){
        addressDetailchk = false
    }
    if (req.body.content == ""){
        contentchk = false
    }

    db.collection('post').findOne({_id : parseInt(req.params.id)},function(err, result){
        db.collection('post').updateOne(
            {_id : parseInt(req.params.id)}, 
            {$set : {
                post_title : titlechk ? req.body.title : result.post_title, 
                post_content : contentchk? req.body.content : result.post_content,
                post_address : addresschk? req.body.address : result.post_address,
                post_address_detail : addressDetailchk? req.body.addressDetail : result.post_address_detail,
            }}, 
            function(err, result) {
                if (err) { res.json({message : "수정 실패"}); }
                else {
                    res.status(200).send({message : "수정 성공"});
                }
            }
        );
    })
    
})

// 게시글 삭제 API
app.delete('/community/delete/:id', function(req, res) {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        if (err) { res.json({message : "삭제 실패"}); }
        if (result.user_id.toString() === req.user._id.toString()) {
            // 게시글 삭제
            db.collection('post').deleteOne({_id : parseInt(req.params.id)}, function(err, result) {
                // 포인트 -30, 게시글 수 -1
                LevelCheck(req.user._id)
                db.collection('user_info').updateOne(
                    {_id : req.user._id}, 
                    {$inc : {user_point : -30, posting_count : -1}}, 
                    function(err, result) {
                        res.json({message : "삭제 완료"});
                    }
                );
            });
            // AWS 이미지 삭제
            // ...
        }
        else { res.json({message : "삭제 실패"}); }
    });
})

// 포인트 페이지 이동 API
app.get("/point", function(req, res){
    if (!req.isAuthenticated()) {
        res.json({message : "로그인이 필요합니다."})
    }
    else{
        db.collection('user_info').findOne({_id : req.user._id}, function(err, result){
            res.send({
                message : "포인트게임",
                point : result.user_point
            }); 
        })
    }
})

// 포인트 게임 처리 코드
app.post("/point/start", function(req, res){
    if (!req.isAuthenticated()) {
        res.json({message : "로그인이 필요합니다."})
    }
    else if (req.body.point < 100){
        res.json({message : "포인트가 부족합니다."})
    }
    else{
        var tempPoint = req.body.point
        const cardValue = Math.floor(Math.random() * 100) + 1
        const value = req.body.value
        var cardResult = ""

        if(cardValue > 0 && cardValue <= 1){
            cardResult = "UR"
            tempPoint = tempPoint + 900
        }
        else if(cardValue > 1 && cardValue <= 10){
            cardResult = "SR"
            tempPoint = tempPoint + 300
        }
        else if(cardValue > 10 && cardValue <= 40){
            cardResult = "R"
            tempPoint = tempPoint - 50
        }
        else if(cardValue > 40 && cardValue <= 100){
            cardResult = "N"
            tempPoint = tempPoint - 80
        }

        db.collection('user_info').updateOne(
            {_id : req.user._id},
            {$set : {user_point : tempPoint}}, function(err, result){
                LevelCheck(req.user._id)
                res.send({
                    message : "포인트게임 완료",
                    point : tempPoint,
                    value : value,
                    cardValue : cardResult,
                });   
        })
    }
})

// control - userinfo 시작 ///////////////////////////////////////////////////////////////////////////

// 내 정보 요청 API
app.get('/mypage', (req, res) => {
    db.collection('user_info').findOne({_id : req.user._id}, function(err, result) {
        LevelCheck(req.user._id)
        const userResult = result;
        if (err) { res.json({message: "로그인 필요"}); }
        else{
            db.collection('post').find({like_user : req.user._id.toString()}).sort({'_id' : -1}).limit(3).toArray(function (err, result) {
                const likeResult = result;
                db.collection('post').find({writer: {$nin: [""]}, user_id : req.user._id}).sort({'_id' : -1}).limit(3).toArray(function(err, result){
                    res.send({
                        message: "불러오기",
                        profile: userResult.profile_image_path,
                        nickname: userResult.nickname,
                        user_level: userResult.user_level,
                        user_point: userResult.user_point,
                        posting_count: userResult.posting_count,
                        like_post: likeResult,
                        write_post : result
                    });
                });
            });
        }
    });
})

// 회원정보 요청 API
app.get('/mypage/edit', (req, res) => {
    res.send({
        message: "불러오기",
        profile: req.user.profile_image_path,
        email: req.user.email,
        nickname: req.user.nickname,
    });
})

// 회원정보 수정 API - 닉네임 변경
app.post('/mypage/edit', (req, res) => {
    var nicknamechk = true

    if (req.body.nickname == ""){
        nicknamechk = false
    }
    db.collection('user_info').findOne({nickname : req.body.nickname}, (err, result) => {
        if (err) { return console.log(err); }
        if (result) { res.json({message: "사용중인 닉네임입니다."}); }
        else {
            db.collection('user_info').findOne({_id : req.user._id}, (err, result) => {
                db.collection('post').update(
                    {user_id : req.user._id},
                    {$set : {writer : nicknamechk ? req.body.nickname : result.writer}}
                )
                db.collection('user_info').updateOne(
                    {_id : req.user._id},
                    {$set : {nickname : nicknamechk ? req.body.nickname : result.nickname}},
                    (err, result) => {
                        if (err) { return console.log(err); }
                        console.log("닉네임 변경 : ", req.user.nickname, " => ", req.body.nickname);
                        res.json({message: "수정 성공"});
                    }
                )
            })
            
        }
    });
})

// 비밀번호 재확인 API
app.post('/mypage/editpw/check', (req, res) => {
    db.collection('user_info').findOne({_id : req.user._id}, (err, result) => {
        if (err) { return console.log(err); }
        if (result.password === req.body.password) { res.json({message: "비밀번호 일치"}); }
        else { res.json({message: "비밀번호가 일치하지 않습니다."}); }
    });
})

app.put('/mypage/editpw/change', (req, res) => {
    db.collection('user_info').updateOne(
        {_id : req.user._id},
        {$set : {password : req.body.password}},
        (err, result) => {
            if (err) { return console.log(err); }
            console.log("변경내역 : ", req.user.password, " => ", req.body.password);
            res.json({message: "비밀번호가 변경되었습니다."});
    });
})

// 좋아요한 게시물 요청
app.get('/mypage/like', (req, res) => { 
    db.collection('post').find({like_user : req.user._id.toString()}).sort({'_id' : -1}).toArray(function(err, result){
        res.send({
            message : "좋아요",
            result : result,
            totalpost : result.length,
        }); 
    })
})

// 내가 쓴 게시물 요청
app.get('/mypage/post', (req, res) => { 
    db.collection('post').find({writer: {$nin: [""]}, user_id : req.user._id}).sort({'_id' : -1}).toArray(function(err, result){
        res.send({
            message : "게시글",
            result : result,
            totalpost : result.length,
        }); 
    })
})

// control - userinfo 끝 ////////////////////////////////////////////////////////////////////////////


// control - image 시작 //////////////////////////////////////////////////////////////////////////////

// 프로필 이미지 업로드 API
app.post('/mypage/profile', (req, res) => {
    console.log("upload profile req :", req.user._id);
    const form = new multiparty.Form();
    const userID = req.user._id;
    const imageDir = "profile/" + userID + "/";
    let profilePath;

    // err 처리
    form.on('error', err => { res.status(500).end(); });
    
    // form 데이터 처리
    form.on('part', async part => {
        profilePath = config.AWS_BUCKET + "/" + imageDir + part.filename;
        // 이미지 저장 디렉토리
        if (!part.filename) { return part.resume(); }
        streamToBufferUpload(part, imageDir + part.filename);
        console.log("경로 :", imageDir + part.filename)
        db.collection('user_info').updateOne(
            {_id : req.user._id}, 
            {$set : {profile_image_path: profilePath}},
            (err, result) => {
                if (err) { return console.log(err); }
                else { console.log("profile_path :", profilePath); } 
            }
        );
    });
        
        // form 종료
    form.on('close', () => {        
        setTimeout(() => { res.send({location: profilePath}) }, 1000)
    });

    form.parse(req);
})

// 프로필 이미지 삭제 API
app.delete('/mypage/profile', (req, res) => {
    console.log("delete profile req :", (req.query))
    const objectParams_del = {
        Bucket: BUCKET_NAME,
        Key: (req.query.url).substr(52),
    };

    s3
        .deleteObject(objectParams_del)
        .promise()
        .then((data) => {
            res.send({
                message: "삭제 성공",
                profile: ""
            });
        })
        .catch((error) => {
            console.error(error);
        });

    db.collection('user_info').updateOne(
        {_id : req.user._id}, 
        {$set : {profile_image_path: ""}}, 
        (err, result) => {
            if (err) { return console.log(err); }
            else { console.log(config.AWS_BUCKET + "/" + (req.query.url).substr(52)) } 
        }
    );
})

// 게시글 이미지 업로드 API
app.post('/image/upload', (req, res) => {
    console.log("/image/upload req");
    const form = new multiparty.Form();
    const userID = req.user._id;
    let imageAddress;

    // err 처리
    form.on('error', (err) => { res.status(500).end(); })
    
    // form 데이터 처리
    form.on('part', async (part) => {
        imageAddress = config.AWS_BUCKET + "/" + userID + "/" + part.filename;
        const postID = Number(part.filename.split('/')[0]);
        // 파일명 X : 이미지 저장 디렉토리
        if (!part.filename) {
            res.send({
                message: "파일명이 올바르지 않습니다.",
                location: ""
            });
        }
        else {
            // 작성중인 빈 게시글 검색
            db.collection('post').findOne({_id: postID}, (err, result) => {
                console.log("postid :", postID, "OK")
                // 작성중인 빈 게시글이 삭제된 경우
                if (!result) {
                    console.log("유효하지 않은 요청")
                    res.send({
                        message: "유효하지 않은 요청",
                        location: ""
                    });
                }
                // 파일명 OK, 배열에 O => 추가 X
                else if (result.image_address.indexOf(imageAddress) !== -1) {
                    console.log("이미 존재하는 파일")
                    res.send({location: ""}); 
                }
                // 파일명 OK, 배열에 X => 추가 O
                else {
                    console.log("새로운 이미지 추가")
                    streamToBufferUpload(part, userID + "/" + part.filename);
                    db.collection('post').findOne({_id : postID}, (err, result) => {
                        let target = result.image_address;
                        target[result.image_address.indexOf(null)] = imageAddress;
                        db.collection('post').updateOne(
                            {_id : postID},
                            {$set : {image_address : target}},
                            (err, result) => {
                                console.log("modified :", result.modifiedCount);
                            }
                        )
                    })
                }            
            })
        }
    });

    // form 종료
    form.on('close', () => {
        setTimeout(() => { res.send({location: imageAddress}) }, 1000);
    });

    form.parse(req);

    
});

// 게시글 이미지 삭제 API
app.delete('/image/delete', (req, res) => {
    const decodeUrl = decodeURIComponent(req.query.url)
    const postID = Number(decodeUrl.split('/')[4]);
    console.log("/image/delete req :", postID);
    
    // AWS 이미지 삭제
    const objectParams_del = {
        Bucket: BUCKET_NAME,
        Key: (decodeUrl).substr(52),
    };
    
    s3
        .deleteObject(objectParams_del)
        .promise()
        .then((data) => {
        })
        .catch((error) => {
            console.error(error);
        });

    // 이미지 주소 삭제
    db.collection('post').findOne({_id: postID}, (err, result) => {
        // 이미지 주소 X
        if (!result) { res.send({message: "삭제 성공"}); }
        // 이미지 주소 O
        else {
            let targetObj = result.image_address;
            console.log("이미지 address :", result.image_address)
            const targetIdx = Number(result.image_address.indexOf(decodeUrl));
            console.log("지울 이미지 :", decodeUrl)
            console.log("타겟 인덱스 :", targetIdx)
            let removeUrl = targetObj.splice(targetIdx, 1);
            console.log("remove :", removeUrl);
            targetObj[3] = null;

            db.collection('post').updateOne(
                {_id: postID},
                {$set: {image_address: targetObj}},
                (err, result) => { res.send({message: "삭제 성공"}); }
            );
        }
    });
})

const streamToBufferUpload = (part, key) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        part.on('data',   (chunk) => chunks.push(Buffer.from(chunk)));
        part.on('error',  ( err ) => reject(err));
        part.on('end',    (     ) => resolve(Buffer.concat(chunks)));
        uploadToBucket(key, part);
    });
}

const uploadToBucket = (key, Body) => {
    const params = {
        Bucket:BUCKET_NAME,
        Key:key,
        Body,
        ContentType: 'image'
    }
    const upload = new AWS.S3.ManagedUpload({ params });
    upload.promise();
}

// control - image 끝 ///////////////////////////////////////////////////////////////////////////////


// service - auth 시작 ///////////////////////////////////////////////////////////////////////////////

// header 로그인 인증
app.post('/islogin', (req, res) => {
    if (!req.user) { res.send({message: "로그인 실패"}); }
    else {
        LevelCheck(req.user._id)
        res.send({
            message: "로그인 성공",
            nickname: req.user.nickname,
            user_level: req.user.user_level
        });
    }
})

// 로그아웃 API
app.post('/signout', (req, res) => {
    req.logout(() => {
        console.log("/signout req");
        req.session.destroy();
        res.clearCookie('connect.sid').send({message: "로그아웃"});
    });
})

// 로그인 API
app.post('/signin', passport.authenticate('local', {}), (req, res) => {
    console.log("signin req :", req.user.email);
    res.send({message: "로그인 성공"});
})

passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: true,
        passReqToCallback: false,
    }, 
    (inputemail, inputpw, done) => {
        console.log("signin : " + inputemail);
        db.collection('user_info').findOne({email: inputemail}, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false, console.log({message: "존재하지 않는 아이디입니다."})); }
            if (user.password === inputpw) { return done(null, user); }
            return done(null, false, console.log({message: "올바르지않은 비밀번호."}));
        });
    }
));

passport.serializeUser((user, done) => {
    console.log("serialize :", user.email);
    done(null, user.email);
});

passport.deserializeUser((usermail, done) => {
    console.log("deserialize :", usermail);
    db.collection("user_info").findOne({email: usermail}, (err, user) => {
        if (err) { return next(err); }
        done(null, user);
    });
});

// 인증메일 발송 API
app.post('/signup/mail', (req, res) => {
    console.log("/signup/mail request :", req.body.email);

    if (!req.body.email) { res.json({ message: "올바른 이메일이 아닙니다." }) }
    if (req.body.email) {
        // 이메일 중복 검사
        db.collection('user_info').findOne({ email : req.body.email }, (err, result) => {
            if (err) { return console.log(err); }
            if (result !== null) {
                // Case 1.
                console.log("/signup/mail response :", { message: "사용중인 이메일입니다." });
                res.json({ message: "사용중인 이메일입니다." });
            } 
            if (result === null) {
                db.collection("auth_request").findOne({ email: req.body.email }, (err, result) => {
                    if (err) { return console.log(err); }
                    // Case 2.
                    if (result !== null) {
                        console.log("/signup/mail response :", { message: "이미 요청이 발생한 이메일입니다." });
                        res.json({ message: "이미 요청이 발생한 이메일입니다." });
                    }
                    // Case 3.
                    if (result === null) {
                        SendAuthMail(req.body.email);
                        console.log("/signup/mail response :", { message: "인증메일이 발송되었습니다." });
                        res.json({ message: "인증메일이 발송되었습니다." });
                    } 
                });
            }
        });
    }
})

// 인증메일
const appDir = './templates/authMail.ejs';


// 인증메일 발송 function
const SendAuthMail = (address) => {
    let authNum = Number(Math.random().toString().substr(2,6));
    let emailtemplate;

    ejs.renderFile(appDir, {authCode : authNum}, (err, data) => {
        if (err) { return console.log(err); }
        emailtemplate = data;
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: config.emails.user,
            pass: config.emails.pass
        }
    });

    let mailOptions = {
        from: `나루`,
        to: address,
        subject: '회원가입을 위한 인증번호를 입력해주세요.',
        html: emailtemplate
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) { return console.log(err); } 
        console.log("Mail sent. " + info.response);
        transporter.close();
    });

    db.collection("auth_request").insertOne({
        email      : address,
        auth_number: authNum,
    }, 
    (err, result) => {
        if (err) { return console.log(err); }
        return true;
    });
}

// 인증번호 확인 API
app.post('/signup/auth', (req, res) => {
    // 인증내역 발생 확인
    db.collection("auth_request").findOne({email: req.body.email},
        function(err, result) {
            console.log("/signup/auth check req :", req.body.email);
            if (err) { res.json({number: req.body.authNum}); }                
            if (result === null) { res.json({message: "인증 요청된 이메일이 아닙니다."}); }                
            if (result.auth_number === Number(req.body.authNum)) {res.json({message: "인증되었습니다."});}
            else res.json({message: "인증번호가 일치하지 않습니다."});
        }
    );
})

// 회원가입 요청 API
app.post('/signup', (req, res) => {
    // nickname 중복검사
    db.collection('user_info').findOne({nickname : req.body.nickname}, (err, result) => {
        console.log("/signup req :", req.body.email);
        if (err) { return console.log(err); } 
        if (result !== null) { res.json({message: "이미 사용중인 닉네임입니다."}); } 
        else {
            db.collection("user_info").insertOne({
                email               : req.body.email,
                nickname            : req.body.nickname,
                password            : req.body.password,
                profile_image_path  : "",
                posting_count       : 0,
                like_post           : [],
                user_point          : 0,
                user_level          : 1,
                daily_point         : 0,
            }, 
            (err, result) => {
                if (err) { res.json({message: "가입오류"}); }
                // 가입완료 후 해당 회원의 인증요청 삭제
                db.collection("auth_request").deleteOne({email: req.body.email});
                console.log("/signup 신규회원 : ", req.body.email);
                res.json({message: "가입되었습니다.🎉"});
            });       
        }
    });
})

// service - auth 끝 ////////////////////////////////////////////////////////////////////////////////