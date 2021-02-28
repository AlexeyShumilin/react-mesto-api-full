require('dotenv')
  .config();
const exspress = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const pageNotFound = require('./routes/pageNotFound');
const { auth } = require('./middleware/auth');
const {
  requestLogger,
  errorLogger,
} = require('./middleware/logger');
const {
  checkLogin,
  checkRegister,
} = require('./middleware/usersValidator');

const { PORT = 3000 } = process.env;

const allowedCors = [
  'http://alexey.students.nomoredomains.icu',
  'https://alexey.students.nomoredomains.icu',
];

const app = exspress();

mongoose.connect('mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(requestLogger);

// crash test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', checkLogin, login);
app.post('/signup', checkRegister, createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('*', pageNotFound);

app.use(errorLogger);

app.use(errors());

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
