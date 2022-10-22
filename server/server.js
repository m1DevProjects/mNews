const feeds = require('../app');
const express = require('express')
const app = express()
const PORT = process.env.PORT || 6969;
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('main', { feeds }));
app.get('/feeds', (req, res) => res.send(feeds));

app.listen(PORT, () => console.log(`Server running on: http://localhost:${PORT}`));