const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.send('메인페이지 입니다.');
})

app.listen(8080, function() {
    console.log('listening on 8080')
});