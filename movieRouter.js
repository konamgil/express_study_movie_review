var express = require('express');
var router = express.Router();

//util
var fs = require('fs');

//DB 정보
var data = fs.readFileSync('./movieData.json');
// var movieList = JSON.parse(data);

//몽고디비설정
var Movie = require('./movieModel');

// logger.info(movieList);

router.get('/movies', showMovieList);
router.post('/addmovie', addMovie);
router.get('/addmovie', showAddMovie);
router.get('/movies/:movieId', showMovieDetail);
router.post('/movies/:movieId', addReview);
router.delete('/movies/:movieId', deleteMovie);
router.put('/movies/:movieId', editMovie);

function editMovie(req, res, next) {
    var movieId = req.params.movieId;
    var title = req.body.title;
    var director = req.body.director;
    var year = parseInt(req.body.year);

    Movie.findById(movieId, function(err, doc) {
        if (err) {
            err.code = 500;
            return next(err);
        }
        if (title) {
            doc.title = title;
        }
        if (director) {
            doc.director = director;
        }
        if (year) {
            doc.year = year;
        }
        doc.save().then(function fulfilled(result) {
            res.send({
                msg: 'success',
                result: result
            });
        }, function rejected(err) {
            err.code = 500;
            next(err);
        });
    });

}


function deleteMovie(req, res, next) {
    var movieId = req.params.movieId;
    Movie.findOneAndRemove({
        _id: movieId
    }).then(function fulfilled(result) {
        res.send({
            msg: 'succedd',
            result: result
        })
    }, function rejected(error) {
        err.code = 500;
        next(err);
    })
}

function showAddMovie(req, res, next) {
    res.render('addMovie')
}

function addMovie(req, res, next) {
    // console.log('addmovie')
    var title = req.body.title;
    var director = req.body.director;
    var year = parseInt(req.body.year);
    var synopsis = req.body.synopsis;


    var movie = new Movie({
        title: title,
        director: director,
        year: year,
        synopsis: synopsis
    });
    movie.save().then(function fulfilled(result) {
        console.log(result);
        // res.send({msg:'success',id:result._id});
        res.redirect('/addMovie');
    }, function rejected(err) {
        err.code = 500;
        next(err);
    });
}
//END ADDMOVIE

//review 내용을 movie.reviews 에 추가하는 함수입니다
function addReview(req, res, next) {
    var movieId = req.params.movieId;
    var review = req.body.review;
    Movie.findById(movieId, function(err, doc) {
        if (err) {
            err.code = 500;
            return next(err);
        }
        doc.addReview(review).then(function fulfilled(result) {
            res.send({msg:'success',result:result});
            // res.redirect('/movies/' + movieId);
        }, function rejected(err) {
            err.code = 500;
            next(err);
        }); // 리뷰 내용 저장
        // doc.reviews.push(review)
        // doc.save().then(function fulfilled(result) {
        //     console.log(result);
        //     res.send({msg:'success',result:result});
        //     // res.redirect('/movies/' + movieId);
        // }, function rejected(err) {
        //     err.code = 500;
        //     next(err);
        // }); // 리뷰 내용 저장
    });
    // res.send({msg:'success'});
}


//movieId를 받아와서 영화를 찾는 함수입니다.
function findMovie(movieId) {
    for (var i = 0; i < movieList.length; i++) {
        var item = movieList[i];
        if (item.movieId == movieId) {
            return item;
        }
    }
    return null;
}

//무비 상세페이지 보여주기
function showMovieDetail(req, res, next) {
    var movieId = req.params.movieId;
    // var movie = findMovie(movieId);
    //
    // if( ! movie ){
    //   var error = new Error('Not Found');
    //   error.code = 404;
    //   return next(error);
    // }
    // // res.send(movie);
    // res.render('movieDetail',{movie:movie});
    Movie.findById(movieId).exec(function(err, doc) {
        if (err) {
            err.code = 500;
            return next(err);
        }
        // res.send(doc);
        res.render('movieDetail', {
            movie: doc
        });

    });
}

//무비 리스트를 보여주는 함수입니다.
function showMovieList(req, res, next) {
    // var data = [];
    // movieList.forEach(function (movie) {
    //   var info = {
    //     movieId : movie.movieId,
    //     title : movie.title
    //   };
    //   data.push(info);
    // });
    Movie.find({}, {
        _id: 1,
        title: 1
    }).then(function fulfilled(docs) {
        console.log('Success : ')
        var result = {
                count: docs.length,
                data: docs
            }
            // res.send(result);
        res.render('index', result); //result 는 현재 배열 { count : data.length, data : data };

    }, function rejected(err) {
        err.code = 500;
        next(err);
    });

    // var result = {
    //   count : data.length,
    //   data : data
    // };
    // res.send(result);
    // res.render('index', result); //result 는 현재 배열 { count : data.length, data : data };
}

module.exports = router;
