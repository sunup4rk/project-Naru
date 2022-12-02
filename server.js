const express = require('express');
const app = express();

app.get('/webtoon', function(req, res) {
    res.send('웹툰을 서비스 해주는 페이지 입니다.');
})

app.get('/game', function(req, res) {
    res.send('게임을 서비스 해주는 페이지 입니다.');
})

app.listen(8080, function() {
    console.log('listening on 8080')
});