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
    saveUninitialized: true
}));

// 패스포트 passport 미들웨어
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());


// 라우터 설정
app.get('/', function(req, res) {
    res.render('main.ejs');             // 메인 페이지
});

app.get('/info', function(req, res) {
    res.render('info.ejs');             // 정보 페이지
});

app.get('/community', function(req, res) {
    res.render('community.ejs');        // 게시판 페이지
});
app.get('/write', function(req, res) {
    res.render('write.ejs');            // 글 작성 페이지
});
app.get('/community_pid', function(req, res) {
    res.render('community_pid.ejs');    // 글 조회 페이지
});

app.get('/point', function(req, res) {
    res.render('point.ejs');            // 포인트 페이지
});

app.get('/QnA', function(req, res) {
    res.render('QnA.ejs');              // 문의 페이지
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
    console.log("접속자 : " + inputemail);

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
            console.log("회원정보 저장완료");
        }
    )
    res.send(`<script type="text/javascript">alert("가입을 환영합니다!"); window.location = "/"; </script>`);
});

                                        // 마이페이지 - 내정보
app.get("/mypage_myInfo", isLogin, (req, res) => {
    res.render("mypage_myInfo.ejs", {userInfo : req.user});
});
function isLogin (req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.send('<script>alert("로그인해주세요"); location.href="/signin";</script>')
    }
}

app.get('/mypage_modifyInfo', function(req, res) {
    res.render('mypage_modifyInfo.ejs', {userInfo : req.user});// └ 개인정보 수정
});
const imageRouter = require('./imageRouter.js');

app.use('/image', imageRouter)
app.get('/upload', function(req, res){
    const body = `
<html>
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
      <form action="/image" enctype="multipart/form-data" method="post">
          <input type="file" name="file1" multiple="multiple">
          <input type="submit" value="Upload file" />
      </form>
  </body>
</html>
`
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(body);
	res.end();
})

app.listen(process.env.PORT2, function(){
	console.log(`running image server on ${process.env.PORT2}`)
})



app.get('/mypage_modifyPw', function(req, res) {
    res.render('mypage_modifyPw.ejs');  // └ 비밀번호 변경
});
app.get('/mypage_likeList', function(req, res) {
    res.render('mypage_likeList.ejs');  // └ 좋아요 한 게시글
});
app.get('/mypage_writeList', function(req, res) {
    res.render('mypage_writeList.ejs'); // └ 작성한 게시글
});
app.get('/mypage_myQnA', function(req, res) {
    res.render('mypage_myQnA.ejs');     // └ 문의내역
});


////////// 회원가입 인증메일 //////////
const ejs = require('ejs');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
var appDir = path.dirname(require.main.filename);

app.post('/mail', async function(req, res) {
    let authNum = Math.random().toString().substr(2,6);
    let emailtemplate;
    ejs.renderFile(appDir+'/templates/authMail.ejs', {authCode : authNum}, function (err, data) {
      if(err){console.log(err)}
      emailtemplate = data;
    });
    
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

    let mailOptions = await transporter.sendMail({
        from: `나루`,
        to: req.body.email,
        subject: '회원가입을 위한 인증번호를 입력해주세요.',
        html: emailtemplate
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        console.log("Mail sent. " + info.response);
        transporter.close()
    });
});



////////// 닉네임 중복 검사 //////////
app.get('/isDuplicate', function(req, res) {
    if (req.query.input === "email") {
        db.collection('user_info').findOne({email : req.query.email}, function(err, result){
            if (err) return console.log(err);
            if (result) res.send(true);
        });   
    } 
    if (req.query.input === "nickname") {
        db.collection('user_info').findOne({nickname : req.query.nickname}, function(err, result){
            if (err) return console.log(err);
            if (result) res.send(true);
        });   
    }    
});