const express = require('express');
const app = express();

require('dotenv').config();

// socket 세팅
const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http);


// 미들웨어 설정
app.use(express.json());
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json())

const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(err, client) {
    if (err) { return console.log(err) }
    db = client.db('Naru');
    app.db = db;

    http.listen(process.env.PORT, function() {
        console.log('listening on', process.env.PORT);
    })
})

// AWS 설정
const AWS = require('aws-sdk');
const multiparty = require('multiparty');

AWS.config.loadFromPath(__dirname + "/config/awsconfig.json");
const BUCKET_NAME = 'bucket-sunu';
const s3 = new AWS.S3();

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const multer = require('multer');


// public 폴더의 내용을 정적파일로 사용
app.use('/public', express.static('public'));

 
// 쿠키 미들웨어
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// 세션 미들웨어
const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 3  // 3시간
    },
    store: new FileStore()
}));

// 패스포트 passport 미들웨어
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

// 시간 미들웨어
var moment = require('moment');

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


// ================================= 크롤링 ================================================== //

// puppeteer.launch( { headless : true } ).then(async browser => {})

const crawlTime = moment().format('YYYY-MM-DD')
const puppeteer = require( "puppeteer" );
const cheerio = require( "cheerio" );
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
        db.collection('crawling').insertOne({
                sort : 'game',
                title : resultGame,
                time : crawlTime,
            }, function(err, result){
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
        var resultMovie = []
        var resultMovieImg = []

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
                    }}, function(err, result    ){
                if(err){
                    console.log("크롤링 실패, 대상 웹페이지를 확인해보세요")
                }   
                else{
                    console.log(index + 1,'번째 영화순위 데이터 입력 완료')
                }
        
            })
        })
  
        // for (var i = 0; i < lists.length; i++){
        // resultMovieImg[i] = $(lists[i]).find("div > div.thumb_item > div.poster_movie > img").attr('src')
        // resultMovie[i] = $(lists[i]).find("div > div.thumb_cont > strong > a").text()
        // }
        // db.collection('crawling').insertOne({
        //         sort : 'movie',
        //         title : resultMovie,
        //         titleimg : resultMovieImg,
        //         time : crawlTime,
        //     }, function(err, result){
        //         if(err){
        //             console.log("크롤링 실패, 대상 웹페이지를 확인해보세요")
        //         }
        //         else{
        //             console.log('영화순위 데이터 입력 완료')
        //         }
        
        //     })
        browser.close();
}

function CrawlCheck(){
    db.collection('crawling').findOne({sort : 'time'}, function(err, result){
        if(result.time !== crawlTime){
            console.log('날짜 변경, 크롤링 재실행')
            db.collection('crawling').updateOne(
                { sort: 'time'}, { $set : {time : crawlTime}},
            )
            db.collection('crawling').deleteOne({sort : 'game'}, function(err, result){})
            CrawlMovie()
            CrawlGame()
        }
        else{
            console.log('크롤링 최신 버전 : ', crawlTime)
        }
    })
}

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

// app.get('/explore/culture', function(req, res){
//     CrawlCheck()
//     db.collection('crawling').findOne({sort : 'movie'}, function(err, result){
//         res.send({
//             message : "영화",
//             result : result.title,
//             image : result.titleimg
//         }); 
//     })
// })

app.get('/explore/culture', function(req, res){
    CrawlCheck()
    console.log("result")
    db.collection('crawling').find({
        sort : 'movietest'
    }).sort({
        'num' : 1
    }).toArray(function(err, result){
        console.log(result)
        res.send({
            message : "영화",
            result : result
        }); 
    })
})

    

// ================================= 크롤링 끝 ================================================== //


    
app.get('/', function(req, res) {
    CrawlMovie()
    // ==================== 크롤링 DB구역에 데이터가 없을 때 한번만! =============================
    // if (true){
    //     db.collection('crawling').insertOne({
    //         sort : 'time',
    //         time : crawlTime,
    //     }, function(err, result){
    //         console.log('최초 데이터 입력')
    //         
    //     })
    // }
    // =========================================================================================
    res.render('main.ejs');   
});




app.get('/explore', function(req, res) {
    res.render('explore.ejs');             // 정보 페이지
});




app.get('/community', function(req, res) { 
    db.collection('post').find().toArray(function(err, result){
        result.reverse()
        if (err) {
            res.json({message : "전송 실패"})
        }
        else {
            console.log("전송");
            res.status(200).send({
                message : "조회 성공",
                result : result,
            });         
        }
    });
})

// ======================================= 검색기능 테스트 영역 ===================================================== //

app.get('/test', function(req, res){
    db.collection('post').find().toArray(function(err, result){
        res.render('community.ejs', {posts : result})
    })
})

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
    // db.collection('post').aggregate(condition).toArray(function(err, result){
        
    //     // if (err) {
    //     //     res.json({message : "검색 오류"})
    //     // }
    //     // else if(result !== undefined){
    //     //     console.log("검색 완료");
    //     //     res.status(200).send({
    //     //         message : "검색 완료",
    //     //         result : result,
    //     //     });         
    //     // }
    //     // else{
    //     //     console.log("검색 완료, 결과값 없음")
    //     //     res.status(200).send({
    //     //         message : "검색 결과 없음",
    //     //         result : result,
    //     //     });  
    //     // }
    // })
})
// ======================================= 검색기능 테스트 영역 끝 =================================================== //


app.get('/best', function(req, res) {
    db.collection('post').find({ 
        'like_count' : { '$gt' : 0 } 
    }).sort({
        'like_count' : -1
    }).limit(3).toArray(function(err, result){
        if (err) {
            res.json({message : "전송 실패"})
        }
        else{
            console.log("인기글 전송");
            res.status(200).send({
                message : "인기글 조회 성공",
                result : result
            });
        }
    });
})

// 좋아요 구현
app.post("/community/detail/like/:id", function(req, res){
    console.log("접속자 : ", req.user._id)
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        var chk = false
        if (!req.isAuthenticated()){
            // req.isAuth() 가 true를 반환하면 비 로그인 상태
            res.json({message : "비회원"})
        }
        else if(result.like_count == 0){
            db.collection('post').updateOne(
                { _id: parseInt(req.params.id)},
                { $inc : {like_count : 1} , $push: { like_user: req.user._id.toString()}},
                )
            db.collection('user_info').updateOne(
                { _id: req.user._id},
                { $push: { like_post: parseInt(req.params.id)}},
            )
            console.log('좋아요 완료')
            res.send({
                message : "좋아요",
                like_count : result.like_count,
            }); 
        }
        else{
            for (var i = 0; i <= result.like_count; i++){
                if(result.like_user[i] == req.user._id.toString()){
                    chk = true
                    break
                }
            }
                if(!chk){
                    console.log('좋아요 완료')
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
                else{
                    console.log('좋아요 취소')
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
app.get("/community/write/", function(req, res) {
    console.log(req.query.message)
    db.collection('post_count').findOne({name : 'postcnt'}, function(err, result) {
        const postId = Number(result.total_post) + 1
        db.collection('post').insertOne({
            _id : postId,
            user_id : req.user._id,
            writer : "", 
            post_title : "", 
            post_content : "", 
            like_count : 0, 
            like_user : [],
            post_address : "",
            post_address_detail : "",
            image_address : [],
            post_time : moment().format('YYYY-MM-DD')
            },
            function(err, result){
                if (err) {
                    res.json({message : "다시 시도해주세요."})
                }
                else {
                    console.log("post_id :", postId, " 발급");
                    UpdatePostCount();
                    res.status(200).json({postId : postId});         
                }
            }
        )
    })
})
app.post("/community/write/:id", function(req, res) {
    db.collection('post').updateOne(
        {_id: req.body.params},
        {$set: {
            _id : req.params.id,
            user_id : req.user._id,
            writer : req.user.nickname, 
            post_title : req.body.title, 
            post_content : req.body.content, 
            like_count : 0, 
            like_user : [],
            post_address : req.body.address,
            post_address_detail : req.body.addressDetail,
            // image_address : [],
            post_time : moment().format('YYYY-MM-DD')
        }}            
        ,
        function(err, result){
            if (err) {
                res.json({message : "등록 실패"})
            }
            else {
                // console.log("post_id :", postId, " 등록");
                UpdateUserInfo(req.user._id);
                res.status(200).json({message : "등록 성공"});         
            }
        }
    )
})

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

app.get('/community/detail/:id', function(req, res) {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        if (err) {
            res.json({message : "글 전송 실패"});
        }
        else{
            if (!req.isAuthenticated()){
                console.log("전송, 비로그인");
                res.status(200).send({
                    message : "비로그인",
                    result : result,
                }); 
            }
            else if (result.user_id.toString() === req.user._id.toString()){
                console.log("전송, 일치");
                res.status(200).send({
                    message : "일치",
                    result : result,
                });         
            }
            else{
                console.log("전송, 불일치");
                res.status(200).send({
                    message : "불일치",
                    result : result,
                });  
            }
        }
        
        
    })
})

// 글 수정 페이지
// 시맨틱 url
app.get("/community/edit/:id", function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        if (err) return err;
        // if (!req.isAuthenticated()){
        //     res.send('<script>alert("작성자만 수정할 수 있습니다. (로그인 필요)"); history.back();</script>')
        // }
        console.log("수정할 글 전송");
            res.status(200).send({
                message : "전송",
                result : result,
            }); 
        
    })
})

app.put('/community/edit/:id', function(req, res) {
    db.collection('post').updateOne(
        {_id : parseInt(req.params.id)}, 
        {$set : {
            post_title : req.body.title, 
            post_content : req.body.content,
            // image_address : {
            //     key: req.user._id + "/" + postId + "/" + req.body.imageName,
            //     url: process.env.IMAGE_SERVER + "/" + req.user._id + "/" + postId + "/" + req.body.imageName,                
            // },
            post_address : req.body.address,
            post_address_detail : req.body.addressDetail,
            }}, 
        function(err, result){
            if (err) {
                res.json({message : "수정 실패"})
            }
            else{
                console.log("전송");
                res.status(200).send({
                    message : "수정 성공",
                });
            }
    })
})

app.delete('/community/delete/:id', function(req, res){ 
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        if (err) {
            res.json({message : "삭제 실패"})
        }
        else if(result.user_id.toString() == req.user._id.toString()){
            db.collection('post').deleteOne({_id : parseInt(req.params.id)}, function(err, result) {
                db.collection('user_info').updateOne({_id : req.user._id}, {$inc : {user_point : -30, posting_count : -1}}, function(err, result) {
                    res.json({message : "삭제 완료"})
                })
            })
            // const objectParams_del = {
            //     Bucket: BUCKET_NAME,
            //     Key: result.post_address.key,
            // };
            // const s3 = new AWS.S3;
            // s3
            //     .deleteObject(objectParams_del)
            //     .promise()
            //     .then((data) => {
            //         console.log('success : ', data);
            //         res.send('<script>alert("삭제가 완료되었습니다."); location.href="/community";</script>')
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //     });
                
            
        }
        else{
            res.json({message : "삭제 실패"})
        }
       
    })
})

// 포인트 페이지
app.get("/point", isPoint, function(req, res){
    res.render('point.ejs',{userpoint : req.user})
})

function isPoint(req, res, next){
    if(req.user){
        console.log(req.user)
          next()
    }
    else{
        res.send('<script>alert("로그인해주세요"); location.href="/signin";</script>')
    }
}

app.post('/point', function(req,res){ 
    if (!req.isAuthenticated()){
        res.send('<script>alert("로그인해주세요"); location.href="/signin";</script>')
    }
    else{
        db.collection('user_info').updateOne(
            {id : req.user.id}, 
            {$set : {point : req.body.getpoint}}, 
            function(err, result){
                if (err) return err;
                    console.log('process complete')
                    res.redirect('/point');
                })
    }
    
})

// control - userinfo 시작 ///////////////////////////////////////////////////////////////////////////

// 내 정보 요청 API
app.get('/mypage', (req, res) => {
    res.send({
        message: "불러오기",
        profile: req.user.profile_image_path,
        nickname: req.user.nickname,
        user_level: req.user.user_level,
        user_point: req.user.user_point,
        posting_count: req.user.posting_count,
    })
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

// 회원정보 수정 API
app.post('/mypage/edit', (req, res) => {
    // 닉네임 변경
    db.collection('user_info').findOne({nickname : req.body.nickname}, function(err, result) {
        if (err) { return console.log(err); }
        if (result) { res.json({message: "사용중인 닉네임입니다."}); }
        else {
            db.collection('user_info').updateOne(
                {_id : req.user._id},
                {$set : {nickname : req.body.nickname}},
                function(err, result) {
                    if (err) { return console.log(err); }
                    console.log("닉네임 변경 : ", req.user.nickname, " => ", req.body.nickname);
                    res.json({message: "수정 성공"});
            });
        }
    });
})

// 비밀번호 재확인 API
app.post('/mypage/editpw/check', (req, res) => {
    db.collection('user_info').findOne({_id : req.user._id}, function(err, result) {
        if (err) { return console.log(err); }
        if (result.password === req.body.password) { res.json({message: "비밀번호 일치"}); }
        else { res.json({message: "비밀번호가 일치하지 않습니다."}); }
    });
})

app.put('/mypage/editpw/change', (req, res) => {
    db.collection('user_info').updateOne(
        {_id : req.user._id},
        {$set : {password : req.body.password}},
        function(err, result) {
            if (err) { return console.log(err); }
            console.log("변경내역 : ", req.user.password, " => ", req.body.password);
            res.json({message: "비밀번호가 변경되었습니다."});
    });
})

// control - userinfo 끝 ////////////////////////////////////////////////////////////////////////////


// control - image 시작 //////////////////////////////////////////////////////////////////////////////

// 프로필 이미지 업로드 API
app.post('/mypage/profile', (req, res) => {
    console.log("request received :", req.user._id);
    const form = new multiparty.Form();
    const USER_ID = req.user._id;
    const IMAGE_DIR = USER_ID + "/profile/";
    let filename;
    
    // err 처리
    form.on('error', function(err) { res.status(500).end(); });
    
    // form 데이터 처리
    form.on('part', async function(part) {
        filename = part.filename;
        // 이미지 저장 디렉토리
        if (!part.filename) { return part.resume(); }
        else {
            streamToBufferUpload(part, filename, IMAGE_DIR);
            db.collection('user_info').updateOne(
                {_id : req.user._id}, 
                {$set : {profile_image_path: process.env.IMAGE_SERVER + "/" + IMAGE_DIR + filename}},
                function(err, result) {
                    if (err) { return console.log(err); }
                    else { console.log(process.env.IMAGE_SERVER + "/" + IMAGE_DIR + part.filename); } 
                }
            );
        }
    });

    // form 종료
    form.on('close', function() {
        res.send({
            location: process.env.IMAGE_SERVER + "/" + IMAGE_DIR + filename,
            filename: filename
        });
    });

    form.parse(req);
})

// 프로필 이미지 삭제 API
app.delete('/mypage/profile', (req, res) => {
    console.log("query :", (req.query.url).substr(52)) 
    const objectParams_del = {
        Bucket: BUCKET_NAME,
        Key: (req.query.url).substr(52),
    };

    s3
        .deleteObject(objectParams_del)
        .promise()
        .then((data) => {
            res.json({message: "삭제 성공"});
        })
        .catch((error) => {
            console.error(error);
        });

    db.collection('user_info').updateOne(
        {_id : req.user._id}, 
        {$set : {profile_image_path: "https://bucket-sunu.s3.ap-northeast-2.amazonaws.com/src/profile/ine.jpg"}}, 
        function(err, result) {
            if (err) { return console.log(err); }
            else { console.log(process.env.IMAGE_SERVER + "/" + (req.query.url).substr(52)) } 
        }
    );
})

// 게시글 이미지 업로드 API
app.post('/image/upload', (req, res) => {
    console.log("request received :", req.user._id);
    console.log("POST_ID :", req.body.postId);
    const form = new multiparty.Form();
    const USER_ID = req.user._id;
    const POST_ID = "";
    const IMAGE_DIR = USER_ID + "/" + POST_ID + "/";
    let filename;
    
    // err 처리
    form.on('error', function(err) { res.status(500).end(); })
    
    // form 데이터 처리
    form.on('part', async function(part) {
        filename = part.filename;
        // 이미지 저장 디렉토리
        if (!part.filename) { return part.resume(); }
        else {
            streamToBufferUpload(part, filename, IMAGE_DIR);
            db.collection('post').updateOne(
                {_id : POST_ID}, 
                {$push : {image_address : process.env.IMAGE_SERVER + "/" + IMAGE_DIR + filename}}, 
                function(err, result) {
                    if (err) { return console.log(err); }
                    else { console.log(process.env.IMAGE_SERVER + "/" + IMAGE_DIR + part.filename); } 
                }
            );
        }
    });

    // form 종료
    form.on('close', function() {
        res.send({
            location: process.env.IMAGE_SERVER + "/" + IMAGE_DIR + filename,
            filename: filename
        });
    });

    form.parse(req);
});

// 게시글 이미지 삭제 API
app.delete('/image/delete/:id', (req, res) => {
    console.log("query :", (req.query.url).substr(52))
    
    const objectParams_del = {
        Bucket: BUCKET_NAME,
        Key: (req.query.url).substr(52),
    };

    s3
        .deleteObject(objectParams_del)
        .promise()
        .then((data) => {
            res.json({message: "삭제 성공"});
        })
        .catch((error) => {
            console.error(error);
        });

    db.collection('post').findOne({_id: req.params.id}, function(err, result) {
        console.log(result);
    });
})

function streamToBufferUpload(part, filename, ADR) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        part.on('data',   (chunk) => chunks.push(Buffer.from(chunk)));
        part.on('error',  ( err ) => reject(err));
        part.on('end',    (     ) => resolve(Buffer.concat(chunks)));
        uploadToBucket(ADR + filename, part);
    });
}

function uploadToBucket(filename, Body) {
    const params = { 
        Bucket:BUCKET_NAME, 
        Key:filename, 
        Body, 
        ContentType: 'image' 
    }
    const upload = new AWS.S3.ManagedUpload({ params });
    return upload.promise();
}

// control - image 끝 ///////////////////////////////////////////////////////////////////////////////


// service - auth 시작 ///////////////////////////////////////////////////////////////////////////////

// header 로그인 인증
app.post('/islogin', (req, res) => {
    console.log("Client SID :", req.body.sessionID);
    console.log("Server SID :", req.sessionID);

    if (req.body.sessionID === req.sessionID) {
        res.send({
            message: "로그인 성공", 
            nickname: req.user.nickname,
            user_level: req.user.user_level,
        });
    }        
    else { res.json({message: "로그인 실패"}); }        
})

// 로그아웃 API
app.post('/signout', (req, res) => {
    console.log("/signout :", req.user.email);
    req.session.destroy();
    res.json({message: "로그아웃"});
});

// 로그인 API
app.post('/signin', passport.authenticate('local', {}), (req, res) => {
    console.log("session created :", req.session)
    res.send({
        message: "로그인 성공", 
        sessionID: req.sessionID
    })
})

passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: true,
        passReqToCallback: false,
    }, 
    function(inputemail, inputpw, done) {
        console.log("signin : " + inputemail);
        db.collection('user_info').findOne({email: inputemail}, function(err, user) {
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
    db.collection("user_info").findOne({email: usermail}, function(err, user) {
        if (err) { return next(err); }
        done(null, user);
    });
});

// 인증메일 발송 API
app.post('/signup/mail', (req, res) => {
    console.log("/signup/mail request :", req.body.email);   // params 확인은 req.query

    if (!req.body.email) { res.json({ message: "올바른 이메일이 아닙니다." }) }
    if (req.body.email) {
        // 이메일 중복 검사
        db.collection('user_info').findOne({ email : req.body.email }, function(err, result) {
            if (err) { return console.log(err); }
            if (result !== null) {
                // Case 1.
                console.log("/signup/mail response :", { message: "사용중인 이메일입니다." });
                res.json({ message: "사용중인 이메일입니다." });
            } 
            if (result === null) {
                db.collection("auth_request").findOne({ email: req.body.email }, function(err, result) {
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

function SendAuthMail(address) {
    let authNum = Number(Math.random().toString().substr(2,6));
    let emailtemplate;

    ejs.renderFile(appDir, {authCode : authNum}, function(err, data) {
        if (err) console.log(err);
        else emailtemplate = data;
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    let mailOptions = {
        from: `나루`,
        to: address,
        subject: '회원가입을 위한 인증번호를 입력해주세요.',
        html: emailtemplate,
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) { console.log(err); } 
        else { console.log("Mail sent. " + info.response); } 
        transporter.close();
    });

    db.collection("auth_request").insertOne({
        email      : address,
        auth_number: authNum,
    }, 
    function(err, result) {
        if (err) { return console.log(err); }
        return true;
    });
}

// 인증메일 변수
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const path = require('path');
let appDir = path.dirname(require.main.filename) + '/templates/authMail.ejs';

// 인증번호 확인 API
app.post('/signup/auth', (req, res) => {
    console.log("authnum request received");

    db.collection("auth_request").findOne({email: req.body.email},
        function(err, result) {
            if (err) 
                res.json({number: req.body.authNum});
            if (result === null)
                res.json({message: "인증 요청된 이메일이 아닙니다."});
            else if (result.auth_number === Number(req.body.authNum))
                res.json({message: "인증되었습니다."});
            else if (result.auth_number !== Number(req.body.authNum))
                res.json({message: "인증번호가 일치하지 않습니다."});
        }
    )
})

// 회원가입 요청 API
app.post('/signup', (req, res) => {
    console.log("/signup request received");

    // nickname 중복검사
    db.collection('user_info').findOne({nickname : req.body.nickname}, function(err, result) {
        if (err) { return console.log(err); } 
        if (result !== null) { res.json({message: "이미 사용중인 닉네임입니다."}); } 
        if (result === null) {
            db.collection("user_info").insertOne({
                email               : req.body.email,
                nickname            : req.body.nickname,
                password            : req.body.password,
                profile_image_path  : process.env.DEFAULT_PROFILE,
                posting_count       : 0,
                like_post           : [],
                user_point          : 0,
                user_level          : 1,
                daily_point         : 0,
            }, 
            function(err, result) {
                if (err) {
                    console.log("/signup error", err);
                    res.json({message: "가입오류"});
                }
                // 가입완료 후 해당 회원의 인증요청 삭제
                db.collection("auth_request").deleteOne({email: req.body.email});
                console.log("/signup 신규회원 : ", req.body.email);
                res.json({message: "가입되었습니다.🎉"});
            });       
        }
    });
})

// service - auth 끝 ////////////////////////////////////////////////////////////////////////////////