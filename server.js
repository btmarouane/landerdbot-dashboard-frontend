var express = require('express');
var app = express();
app.use(express.static('./dist/tagspredictapp'));
app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/tagspredictapp/'}
);
});
app.listen(process.env.PORT || 8080);
