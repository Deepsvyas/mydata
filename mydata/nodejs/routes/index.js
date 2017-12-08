
/*
 * GET home page.
 */

exports.helloword = function(req, res){
  res.render('index', { title: 'Hello World' });
};

