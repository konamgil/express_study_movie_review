//create server
var express = require('express');
var app = express();
//util
var fs = require('fs');

var winston = require('winston');
winston.add(require('winston-daily-rotate-file'),{datePattern:'yyyyMMdd',filename:'service.log'})

var logger =  new winston.Logger({
  transports:[
    new winston.transports.Console(),
    new winston.transports.File({
      name:'error-logger',
      filename:'service-error.log',
      level:'info'
    })
  ]
});

//DB 정보
var data = fs.readFileSync('./movieData.json');
var movieList = JSON.parse(data);
// logger.info(movieList[0])

//로그 미들웨어 설정
var morgan = require('morgan');
app.use(morgan('dev'));

//템플릿 엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static('./'));
app.get('/',function (req,res) {
  res.render('index', {title:'Favorite Movie',movie:movieList});
});
app.get('/:number',function (req, res) {
  res.render('reviewInfo',{title:'영화 상세 정보',movie:movieList[req.params.number]});
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.setHeader('Content-type','text/html')
  res.status(500).send('<h2>Error 500 - 없는 페이지입니다.</h2>');
});
app.listen(7681,function () {
  logger.info('포트번호는 7681 입니다')
});
