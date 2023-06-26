require('dotenv').config();

const express = require('express');
const app = express();
const mogoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const contactsRouter = require('./controllers/contacts');
const { userExtractor } = require('./middleware/auth');
const logoutRouter = require('./controllers/logout');
const { MONGO_URI } = require('./config');

app.use(cors());
app.use(express.json());
app.use(cookieParser());


(async () => {  
    try{
         await mogoose.connect(MONGO_URI);
         console.log('conectado a mongo DB')
    } catch (error) {
        console.log(error);
    }
})();




// Rutas Frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/agenda', express.static(path.resolve('views', 'agenda')));
app.use('/images', express.static(path.resolve('img')));

// Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/contacts',userExtractor  ,contactsRouter);


app.use(morgan('tiny'));

module.exports = app;