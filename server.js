var express = require('express');
var app = express();
app.use(express.static('./dist/dashboard'));
app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/dashboard/'}
);
});
app.listen(process.env.PORT || 8080);
