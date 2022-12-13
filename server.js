const express = require('express');
const app = express();

require('dotenv').config();

// socket 세팅
const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http);


// 미들웨어 설정
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json())

var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(err, client) {
    if (err) { return console.log(err) }
    db = client.db('Naru');
    app.db = db;

    http.listen(process.env.PORT, function() {
        console.log('listening on 8080');
    })
})

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
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7},
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

// 라우터 설정
app.get('/', function(req, res) {
    const puppeteer = require( "puppeteer" );
    const cheerio = require( "cheerio" );

    // puppeteer.launch( { headless : true } ).then(async browser => {})

    const crawlTime = moment().format('YYYY-MM-DD');

    async function CrawlGame () {
        const browser = await puppeteer.launch({
            headless: true
          });
          // 새로운 페이지를 연다.
          const page = await browser.newPage();
          // "https://www.goodchoice.kr/product/search/2" URL에 접속한다. (여기어때 호텔 페이지)
          await page.goto('https://www.thelog.co.kr/index.do');
          // 페이지의 HTML을 가져온다.
          const content = await page.content();
          // $에 cheerio를 로드한다.
          const $ = cheerio.load(content);
          // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
          const lists = $("#game_rank > tr");
          var resultGame = []
          for (var i = 0; i < lists.length; i++){
            resultGame[i] = $(lists[i]).find("tr > td.name").text()
          }
          // 모든 리스트를 순환한다.
          db.collection('crawling').insertOne({
                    sort : 'game',
                    title : resultGame,
                    time : crawlTime,
                }, function(err, result){
            console.log('게임순위 데이터 입력')
                })
          // 브라우저를 종료한다.
          browser.close();
    }


    async function CrawlMovie () {
        const browser = await puppeteer.launch({
            headless: true
          });
        
          // 새로운 페이지를 연다.
          const page = await browser.newPage();
          // "https://www.goodchoice.kr/product/search/2" URL에 접속한다. (여기어때 호텔 페이지)
          await page.goto('https://movie.daum.net/ranking/boxoffice/weekly');
          // 페이지의 HTML을 가져온다.
          const content = await page.content();
          // $에 cheerio를 로드한다.
          const $ = cheerio.load(content);
          // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
          const lists = $("#mainContent > div > div.box_boxoffice > ol > li");
          var resultMovie = []
          var resultMovieImg = []
          // 모든 리스트를 순환한다.
          for (var i = 0; i < lists.length; i++){
            resultMovieImg[i] = $(lists[i]).find("div > div.thumb_item > div.poster_movie > img").attr('src')
            resultMovie[i] = $(lists[i]).find("div > div.thumb_cont > strong > a").text()
          }
          db.collection('crawling').insertOne({
                    sort : 'movie',
                    title : resultMovie,
                    titleimg : resultMovieImg,
                    time : crawlTime,
                }, function(err, result){
            console.log('영화순위 데이터 입력')
                })
          // 브라우저를 종료한다.
          browser.close();
    }

    // ==================== 크롤링 DB구역에 데이터가 없을 때 한번만! =============================
    // if (true){
    //     db.collection('crawling').insertOne({
    //         sort : 'time',
    //         time : crawlTime,
    //     }, function(err, result){
    //         console.log('최초 데이터 입력')
    //         CrawlGame()
    //         CrawlMovie()
    //     })
    // }
    // =========================================================================================

    db.collection('crawling').findOne({sort : 'time'}, function(err, result){
        if(result.time !== crawlTime){
            console.log('날짜 변경, 크롤링 재실행')
            db.collection('crawling').updateOne(
                { sort: 'time'}, { $set : {time : crawlTime}},
            )
            db.collection('crawling').deleteOne({sort : 'game'}, function(err, result){})
            db.collection('crawling').deleteOne({sort : 'movie'}, function(err, result){})
            CrawlGame()
            CrawlMovie()
        }
        else{
            console.log('최근 크롤링 날짜 : ', crawlTime, '값이 유효합니다.')
        }
    })
    res.render('main.ejs');             // 메인 페이지
});

app.get('/explore', function(req, res) {
    res.render('explore.ejs');             // 정보 페이지
});

app.get('/community', function(req, res) {
    db.collection('post').find().toArray(function(err, result){
        res.render('community.ejs', {posts : result});        // 게시판 페이지
    });
})


// 좋아요 구현
app.post("/like/:id", function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        var chk = false
        if (!req.isAuthenticated()){
            res.send('<script>alert("회원만 좋아요가 가능합니다."); history.back();</script>')
        }
        else{
            if(result.like_count == 0){
                db.collection('post').updateOne(
                    { _id: parseInt(req.params.id)},
                    { $inc : {like_count : 1} , $push: { like_user: req.user._id.toString()}},
                )
                console.log('좋아요 완료')
                res.redirect(req.get('referer'))
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
                     res.redirect(req.get('referer'))
                }
                else{
                    console.log('좋아요 취소')
                    db.collection('post').updateOne(
                        { _id: parseInt(req.params.id)},
                        { $inc : {like_count : -1} , $pull: { like_user: req.user._id.toString()}},
                    )
                    res.redirect(req.get('referer'))
                }
            }
        }
    })
})

app.get('/community/write', function(req, res) {
    res.render('write.ejs');            // 글 작성 페이지
});

app.post("/add", function(req, res) {
    db.collection('post_count').findOne({name : 'postcnt'}, function(err, result) {
        const postId = Number(result.total_post) + 1
        db.collection('post').insertOne({
            _id : postId,
            user_id : req.user._id,
            writer : req.user.nickname, 
            post_title : req.body.title, 
            post_content : req.body.content, 
            like_count : 0, 
            like_user : [],
            post_address : "",
            post_time : moment().format('YYYY-MM-DD [작성]')
            },
            function(err, result){
                if (err) return console.log(err);
                else {
                    console.log("post_id :", postId, " 등록");
                    UpdatePostCount();
                    UpdateUserInfo(req.user._id);
                    res.status(200).json({post_id: postId});         
                }
            }
        )
    })
})

function CheckPostCount() {
    db.collection('post_count').findOne({
        name : 'postcnt'
    }, 
    function(err, result) {
        if (err) return console.log(err)
        else {
            const totalPost = result.total_post
            return totalPost;
        }
    });
}

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
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err,result){
        if(err) return err;
        res.render('detail.ejs',{data : result}) // 글 조회 페이지
    })
})

// 글 수정 페이지
// 시맨틱 url
app.get("/community/edit/:id", function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        if (err) return err;
        if (!req.isAuthenticated()){
            res.send('<script>alert("작성자만 수정할 수 있습니다. (로그인 필요)"); history.back();</script>')
        }
        else if(result.user_id.toString() === req.user._id.toString()){
           res.render('edit.ejs', {post : result})
        }
        else{
            res.send('<script>alert("작성자만 수정할 수 있습니다."); history.back();</script>')
        }
    })
})

app.put('/edit/post/:id', function(req,res){
    console.log(req)
    db.collection('post').updateOne(
        {_id : parseInt(req.params.id)}, 
        {$set : {post_title : req.body.title, post_content : req.body.content}}, 
        function(err, result){
        if (err) return err;
        res.send('<script>alert("수정이 완료되었습니다."); location.href="/community";</script>')
        console.log('수정 완료')
    })
})

app.post('/delete/:id', function(req, res){ 
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        if (!req.isAuthenticated()) {
            res.send('<script>alert("권한이 없습니다. (로그인 필요)"); history.back();</script>')
        }
        else if(result.user_id.toString() == req.user._id.toString()){
            db.collection('post').deleteOne({_id : parseInt(req.params.id)}, function(err, result) {
                db.collection('user_info').updateOne({_id : req.user._id}, {$inc : {user_point : -30, posting_count : -1}}, function(err, result) {
                })
                res.send('<script>alert("삭제가 완료되었습니다."); location.href="/community";</script>')
            })
        }
        else{
            res.send('<script>alert("권한이 없습니다. (작성자만 삭제 가능)"); history.back();</script>')
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


app.get('/qna', function(req, res) {
    res.render('qna.ejs');              // 문의 페이지
});

app.get('/signin', function(req, res) {
    res.render('signin.ejs');           // 로그인 페이지
});
app.post('/signin', passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/fail'
    }), (req, res) => {
    res.redirect('/');
});
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    passReqToCallback: false,
}, function(inputemail, inputpw, done) {
    console.log("Sign in : " + inputemail);

    db.collection('user_info').findOne({email: inputemail}, function(err, result) {
        if (err) {return done(err);}
        if (!result) {return done(null, false, {message: "존재하지 않는 아이디입니다."});}
        // 로그인 성공 -> passport.serializeUser 로 전달
        if (result.password === inputpw) {return done(null, result);}
        return done(null, false, {message: "올바르지않은 비밀번호."});
    })
}));
// 로그인 성공시 세션을 생성
passport.serializeUser(function(user, done) {
    done(null, user.email);
});
passport.deserializeUser((useremail, done) => {
    db.collection("user_info").findOne({email: useremail}, function(err, result) {
        done(null, result);
    })
});
// 로그인 실패
app.get("/fail", (req, res) => {
    res.send("로그인 해주세요.");
});

// 로그아웃
app.get("/signout", function(req, res){
   
    req.session.destroy();
    console.log("signout success");   
    res.redirect('/')
});

app.get('/signup', function(req, res) {
    res.render('signup.ejs');           // 회원가입 페이지
});

app.post("/signup", function(req, res){
    db.collection("user_info").insertOne({
        email               : req.body.email,
        nickname            : req.body.nickname,
        password            : req.body.password1,
        profile_image_path  : process.env.DEFAULT_PROFILE,
        posting_count       : 0,
        user_point          : 0,
        user_level          : 1,
        daily_point         : 0,
        }, 
        function(err, result){
            if (err) return console.log(err);
            console.log("신규회원 등록 : ", req.body.email);
        }
    )
    db.collection("auth_request").deleteOne({
        email: req.body.email,
    })
    res.send(`<script type="text/javascript">alert("가입을 환영합니다!"); window.location = "/"; </script>`);
});

                                        // 마이페이지 - 내정보
app.get("/mypage", IsLogin, (req, res) => {
    console.log(req.user)
    res.render("mypage.ejs", {userInfo : req.user});
});
function IsLogin (req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.send('<script>alert("로그인해주세요"); location.href="/signin";</script>')
    }
}

app.get('/mypage/edit', IsLogin, function(req, res) {
    res.render('mypage_edit.ejs', {userInfo : req.user});// └ 개인정보 수정
});

const imageRouter = require('./imageRouter.js');
//////////////////////////////////////////////////////////////////////////////////////////////
// app.use('/image', imageRouter);

const AWS = require('aws-sdk');
const multiparty = require('multiparty');
const sharp = require('sharp');
AWS.config.loadFromPath(__dirname + "/config/awsconfig.json");
const BUCKET_NAME = 'bucket-sunu';

app.post('/imageUpload', function(req, res) {
    console.log("request received :", req.user._id);
    const form = new multiparty.Form()
    // 에러 처리
    form.on('error', function(err) {
        res.status(500).end()
    })
    // form 데이터 처리
    form.on('part', function(part) {
        // 이미지 저장 디렉토리
        const USER_ID = req.user._id;
        const POST_ID = part.name;
        const IMAGE_DIR = USER_ID + "/" + POST_ID + "/";
        if(!part.filename) 
            return part.resume()
        else {
            const filename = part.filename;
            streamToBufferUpload(part, filename, IMAGE_DIR);
            db.collection('post').updateOne({_id : POST_ID}, {$set : {post_address : process.env.IMAGE_SERVER + "/" + IMAGE_DIR + filename}}, function(err, result){
                if (err) return console.log(err);
                else console.log("이미지주소첨부 :", process.env.IMAGE_SERVER + "/" + IMAGE_DIR + filename)

            });
        }
        
    })
    // form 종료
    form.on('close', function() {
        res.send(true);
    });
    form.parse(req);
});

function streamToBufferUpload(part, filename, ADR){
    const chunks = [];
    return new Promise((resolve, reject) => {
        part.on('data',   (chunk) => chunks.push(Buffer.from(chunk)));
        part.on('error',  ( err ) => reject(err));
        part.on('end',    (     ) => resolve(Buffer.concat(chunks)));
        uploadToBucket(ADR + filename, part)
    })
}
function uploadToBucket(filename, Body){
    const params = { Bucket:BUCKET_NAME, Key:filename, Body, ContentType: 'image' }
    const upload = new AWS.S3.ManagedUpload({ params });
    return upload.promise()
}

//////////////////////////////////////////////////////////////////////////////////////////////
app.get('/upload', function(req, res){
    res.render("upload.ejs")
	res.writeHead(200, {"Content-Type": "text/html"});
	res.end();
})
app.listen(process.env.PORT2, function(){
	console.log(`running image server on ${process.env.PORT2}`)
})
const imageEditRouter = require('./imageEditRouter.js');
app.use('/imageEdit', function(req, res) {
    const router = require('express').Router();
    const AWS = require('aws-sdk');
    
    AWS.config.loadFromPath(__dirname + "/config/awsconfig.json");
    
    // S3 객체 얻기
    const s3 = new AWS.S3();

    const BUCKET_NAME = 'bucket-sunu';
    
    //* 버켓의 객체 리스트 출력

    console.log("imageEditRouter 접속")

    
    const objectParams_del = {
        Bucket: BUCKET_NAME,
        Key: `639435f18333d6a94d91271e/`,
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
});

// const upload = multer({ dest: path.join(__dirname, 'uploads/') });
// app.get('/test',upload.array('images', 5), async (req, res, next) => {
//     const test = req.files ?? [];
//     await utilClass.uploadImageToS3(test);
//     res.send('OK')
// });
// async function uploadImageToS3(images) {
//     AWS.config.loadFromPath(__dirname + "/config/awsconfig.json");
//     const s3 = new AWS.S3();

//     const promiseList = images.map((file) => {
//         const fileStream = fs.createReadStream(file.path);

//         return s3.upload({
//                 Bucket: 'bucket-sunu',
//                 // 파일명
//                 Key: `uploads/${file.originalname}`,
//                 Body: fileStream,
//             })
//             .promise();
//     });

//     const result = await Promise.all(promiseList);

//     for (let i = 0; i < files.length; i++) {
//         fs.unlink(files[i].path, (err) => {
//             if (err) throw err;
//         });
//     }

//     return result;
// }


app.get('/mypage/editPW', IsLogin, function(req, res) {
    res.render('mypage_editPW.ejs', {userInfo : req.user});  // └ 비밀번호 변경
});

app.post('/verifyPassword', function(req, res) {
    db.collection('user_info').findOne({_id : req.user._id}, function(err, result){
        if (err) return console.log(err);
        if (result.password == req.body.password) res.send("verified");
        else res.send()
    });   
})

app.put('/editPassword', function(req, res) {
    console.log(req);
    db.collection('user_info').updateOne({_id : req.user._id}, {$set : {password : req.body.password[0]}}, function(err, result){
        if (err) return console.log(err);
        console.log("비밀번호 수정 : ", req.user.email);
        console.log("변경내역 : ", req.user.password, " => ", req.body.password);
        console.log("수정된 항목 수", result.modifiedCount);
    });
    res.send(`<script type="text/javascript">alert("변경되었습니다."); window.location = "/mypage"; </script>`);
})

app.get('/mypage/like', IsLogin, function(req, res) {
    res.render('mypage_like.ejs', {userInfo : req.user});  // └ 좋아요 한 게시글
}); 
app.get('/mypage/post', IsLogin, function(req, res) {
    res.render('mypage_post.ejs', {userInfo : req.user}); // └ 작성한 게시글
});
app.get('/mypage/qna', IsLogin, function(req, res) {
    res.render('mypage_qna.ejs', {userInfo : req.user});     // └ 문의내역
});

 
////////// 회원가입 인증메일 //////////
const ejs = require('ejs');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
var appDir = path.dirname(require.main.filename);

app.post('/mail',  function(req, res) {
    let authNum = Math.random().toString().substr(2,6);
    let emailtemplate;
    ejs.renderFile(appDir+'/templates/authMail.ejs', {authCode : authNum}, function (err, data) {
      if(err){console.log(err)}
      emailtemplate = data;
    });
    
    db.collection("auth_request").findOne({
            email: req.body.email
        }, 
        async function(err, result){
            if (err) return console.log(err);
            if (result === null) {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.NODEMAILER_USER,
                        pass: process.env.NODEMAILER_PASS,
                    }
                });
            
                let mailOptions = {
                    from: `나루`,
                    to: req.body.email,
                    subject: '회원가입을 위한 인증번호를 입력해주세요.',
                    html: emailtemplate
                };
            
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) console.log(err);
                    console.log("Mail sent. " + info.response);
                    
                    transporter.close();
                });
            
                db.collection("auth_request").insertOne({
                    email               : req.body.email,
                    auth_number         : authNum,
                    }, 
                    function(err, result){
                        if (err) return console.log(err);
                        console.log("신규 인증 요청 생성");
                        res.send("send");
                    }
                )
            }
            else {
                console.log(result)
                res.send("exist");
            }
        }
    )


});

////////// 닉네임 중복 검사 //////////
app.post('/isDuplicate', function(req, res) {
    if (req.body.input === "email") {
        db.collection('user_info').findOne({email : req.body.email}, function(err, result){
            if (err) return console.log(err);
            if (!(result === null)) res.send(true)
            if (result === null) res.send(false)
        });   
    } 
    if (req.body.input === "nickname") {
        db.collection('user_info').findOne({nickname : req.body.nickname}, function(err, result){
            if (err) return console.log(err);
            if (result) res.send(true);
            else res.send(false);
        });   
    }    
});

app.post('/authCheck', function(req, res) {
    db.collection('auth_request').findOne({email : req.body.email}, function(err, result){
        if (err) return console.log(err);
        if (result) {
            if(req.body.authNum == result.auth_number) res.send(true);
            else res.send(result.email);
        }
        else res.send(false);
    });   
})

