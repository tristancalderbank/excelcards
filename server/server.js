const express = require('express');

const app = express();
const server = require('http').Server(app);
const config = require('../config');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', 'public');
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname }/public/index.html`));
});

server.listen(config.SERVER.PORT, () => {
    console.log(`listening on *:${config.SERVER.PORT}`);
});
