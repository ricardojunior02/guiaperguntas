const expres = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Ask = require('./models/Ask');
const Response = require('./models/Response');

connection.authenticate().then(() => console.log('conexao feita com sucesso')).catch(err => console.log(err.message))

const app = expres();

app.set('view engine', 'ejs');
app.use(expres.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  Ask.findAll({ raw: true, order: [
    ['id', 'DESC']
  ] }).then(question =>  
    res.render('index', { question }))
});

app.get('/toask', (req, res) => {
  res.render('toask');
});

app.post('/savequestion', (req, res) => {
  const { title } = req.body;
  const { description } = req.body;
  Ask.create({ title, description }).then(() => {
    res.redirect('/');
  })
});

app.get('/question/:id', (req, res) => {
  const id = req.params.id;

  Ask.findOne({ where: { id: id } }).then(response => {
    if(response != undefined) {
      Response.findAll({ where: { questionId: response.id }, order: [
        ['id', 'DESC']
      ]}).then(answers => {
        res.render('question', {
          question: response,
          responses: answers
        })
      });
    } else {
      res.redirect('/');
    }
  });
});

app.post('/response', (req, res) => {
    const body = req.body.body;
    const questionId = req.body.questionId;

    Response.create({ body: body, questionId: questionId }).then(() => {
      res.redirect(`/question/${questionId}`);
    })
});

app.listen(3333, () => {
  console.log("Sever is running...")
});