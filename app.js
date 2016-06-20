//create server
var express = require('express');
var app = express();
//로그 미들웨어 설정
var morgan = require('morgan');
app.use(morgan('dev'));
//템플릿 엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static('./'));
//바디 파서
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
//json 형태로 파싱합니다
app.use(bodyParser.json());

var routerList = require('./movieRouter')
app.use(routerList);

//파비콘 처리
var favicon = require('express-favicon');
app.use(favicon(__dirname + '/favicon.ico'));





//namgil's routing
app.get('/',function (req,res) {
  // res.render('index', {title:'Favorite Movie',movie:movieList});
  res.end('Welcome to Movies app');
});
// app.get('/:number',function (req, res) {
//   res.render('reviewInfo',{title:'영화 상세 정보',movie:movieList[req.params.number]});
// });

app.use(handleError);

function handleError(err, req, res, next) {
  console.log('Error : ', err);
  res.status(err.code).send({msg:err.message});
}

//500 에러 처리
// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.setHeader('Content-type','text/html')
//   res.status(500).send('<h2>Error 500 - 없는 페이지입니다.</h2>');
// });
app.listen(7683,function () {
  logger.info('포트번호는 7683 입니다')
});



//log 처리
var winston = require('winston');
winston.add(require('winston-daily-rotate-file'),{datePattern:'yyyyMMdd',filename:'service.log'})

var logger =  new winston.Logger({
  transports:[
    new winston.transports.Console(),
    new winston.transports.File({
      name:'error-logger',
      filename:'service-error.log',
      level:'error'
    })
  ]
});
