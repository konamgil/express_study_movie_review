//몽구스 연결
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/Moviest';
mongoose.connect(url);
//몽구스 연결 end

var conn = mongoose.connection;

conn.on('error', function(err) {
   console.log('Error : ', err);
});
conn.on('open', function() {
   console.log('디비연결되었습니다');
});

var MovieScheme = mongoose.Schema({
  title : String,
  director : String,
  year : Number,
  synopsis : String,
  reviews : [String] //배열
});

// movies 콜렉션으로 생성
module.exports.Movie = mongoose.model('Movie', MovieScheme);

// var Movie = mongoose.model('Movie', MovieScheme);

// var movie1 = new Movie({title:'인터스텔라2'},{director:'크리스토퍼 놀란2'},{year:20124});
// movie1.save(function (err,results,rows) {
//   if ( err ) {
//       console.log('Error 발생');
//   } else {
//     console.log('Success');
//   }
// });


// Movie.create({title:'아바타',director:'제임스 카메론',year:'20212'}).then(function fulfilled(result) {
//   console.log('Success : ', result);
// }, function rejected(err) {
//   console.error('Error : ', err);
// });
