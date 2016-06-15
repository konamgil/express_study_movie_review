var express = require('express');
var router = express.Router();

//util
var fs = require('fs');
//DB 정보
var data = fs.readFileSync('./movieData.json');
var movieList = JSON.parse(data);
// logger.info(movieList);

router.get('/movies',showMovieList);
router.get('/movies/:movieId', showMovieDetail);
router.post('/movies/:movieId', addReview);

//review 내용을 movie.reviews 에 추가하는 함수입니다
function addReview(req, res, next) {
  var movieId = req.params.movieId;
  var movie = findMovie(movieId);
  if( ! movie ){
    var error = new Error('Not Found');
    error.code = 404;
    return next(error);
  }

  var review = req.body.review;
  movie.reviews.push(review);
  // res.send({msg:'success'});

  // 리뷰 내용 저장
  fs.writeFileSync('./movieData.json', JSON.stringify(movieList,null,1));

  res.redirect('/movies/' + movieId);
}
//movieId를 받아와서 영화를 찾는 함수입니다.
function findMovie(movieId) {
  for(var i=0; i<movieList.length; i++){
    var item = movieList[i];
    if ( item.movieId == movieId){
      return  item;
    }
  }
  return null;
}

//무비 상세페이지 보여주기
function showMovieDetail(req, res, next) {
  var movieId = req.params.movieId;
  var movie = findMovie(movieId);

  if( ! movie ){
    var error = new Error('Not Found');
    error.code = 404;
    return next(error);
  }
  // res.send(movie);
  res.render('movieDetail',{movie:movie})
}

//무비 리스트를 보여주는 함수입니다.
function showMovieList(req, res) {
  var data = [];
  movieList.forEach(function (movie) {
    var info = {
      movieId : movie.movieId,
      title : movie.title
    };
    data.push(info);
  });
  var result = {
    count : data.length,
    data : data
  };
  // res.send(result);
  res.render('index', result); //result 는 현재 배열 { count : data.length, data : data };
}
function updateTotalDB() {

}

module.exports = router;
