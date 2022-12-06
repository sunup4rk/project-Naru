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
    db = client.db('Naroo');
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

app.get('/signup', function(req, res) {
    res.render('signup.ejs');           // 회원가입 페이지
});

app.get('/mypage_myInfo', function(req, res) {
    res.render('mypage_myInfo.ejs');    // 마이페이지 - 내정보
});
app.get('/mypage_modifyInfo', function(req, res) {
    res.render('mypage_modifyInfo.ejs');// └ 개인정보 수정
});
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


