const express = require("express");
const { engine } = require("express-handlebars");
const conn = require("./db/conexao");

const User = require("./models/User");

const server = express();
const port = 3000;

//Permite que objetos de array sejam passados por URL
server.use(express.urlencoded({ extended: true }));
//Middleware para processar dados JSON enviados no corpo da requisição
server.use(express.json());

server.engine("handlebars", engine());
server.set("view engine", "handlebars");

server.use(express.static("public"));

server.get('/users/create', (req, res) => {
  res.render("adduser")
})

server.post('/users/create', async (req, res) => {
  const name = req.body.nameUser
  const occpation = req.body.occupation
  let newsletter = req.body.newsletter

  if(newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  await User.create({name, occpation, newsletter})

  res.redirect('/')

})

server.get('/users/:id', async (req, res) => {
  const id = req.params.id

  const user = await User.findOne({raw: true, where: {id:id}})

  res.render('userview', { user})
})


server.post('/users/delete/:id',async (req, res) => {
  const id = req.params.id

  await User.destroy({where: {id:id}})

  res.redirect('/')
})


server.get('/users/edit/:id',async (req, res) => {
  const id = req.params.id

  const user = await User.findOne({ raw: true, where: {id:id}})

  res.render('useredit', {user})
})

server.post('/users/update',  async (req, res) => {
  const id = req.body.id
  const name = req.body.name 
  const occpation = req.body.occpation
  let newsletter = req.body.newsletter

  if(newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  const userData = {
    id: id,
    name: name,
    occpation: occpation,
    newsletter: newsletter
  }

  await User.update(userData, {where: {id:id}})

  res.redirect('/')
})


//barra principal
server.get("/", async (req, res) => {

  const users = await User.findAll({raw: true})

  console.log(users)

  res.render('home', {users: users});
});

conn
  .sync()
  .then(() => {
    server.listen(port, () => {
      console.log(`servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
