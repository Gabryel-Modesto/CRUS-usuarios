const express = require("express"); // Importando o Express para criar o servidor
const { engine } = require("express-handlebars"); // Importando o motor de templates Handlebars
const conn = require("./db/conexao"); // Importando a conexão com o banco de dados

const User = require("./models/User"); // Importando o modelo de usuário

const server = express(); // Criando uma instância do servidor Express
const port = 3000; // Definindo a porta que o servidor vai escutar

// Permite que objetos de array sejam passados por URL
server.use(express.urlencoded({ extended: true }));

// Middleware para processar dados JSON enviados no corpo da requisição
server.use(express.json());

// Definindo o motor de templates Handlebars para o Express
server.engine("handlebars", engine());
server.set("view engine", "handlebars");

// Configurando a pasta 'public' para arquivos estáticos (como CSS, JS, imagens)
server.use(express.static("public"));

// Rota para exibir o formulário de criação de um novo usuário
server.get('/users/create', (req, res) => {
  res.render("adduser") // Renderiza o template 'adduser' que contém o formulário
});

// Rota para criar um novo usuário (POST)
server.post('/users/create', async (req, res) => {
  const name = req.body.nameUser // Pegando o nome do usuário enviado no formulário
  const occpation = req.body.occupation // Pegando a ocupação do usuário
  let newsletter = req.body.newsletter // Verificando se o usuário escolheu receber newsletter

  // Se o checkbox de newsletter estiver marcado, setamos como true, caso contrário, false
  if(newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  // Criando o novo usuário no banco de dados
  await User.create({name, occpation, newsletter})

  res.redirect('/') // Após criar, redireciona para a página inicial
});

// Rota para exibir os dados de um usuário específico (GET)
server.get('/users/:id', async (req, res) => {
  const id = req.params.id // Pegando o ID do usuário da URL

  // Buscando o usuário no banco de dados com o ID fornecido
  const user = await User.findOne({raw: true, where: {id:id}})

  // Renderizando o template 'userview' com os dados do usuário
  res.render('userview', { user })
});

// Rota para excluir um usuário (POST)
server.post('/users/delete/:id', async (req, res) => {
  const id = req.params.id // Pegando o ID do usuário da URL

  // Excluindo o usuário do banco de dados
  await User.destroy({ where: {id:id} })

  res.redirect('/') // Após excluir, redireciona para a página inicial
});

// Rota para exibir o formulário de edição de um usuário (GET)
server.get('/users/edit/:id', async (req, res) => {
  const id = req.params.id // Pegando o ID do usuário da URL

  // Buscando os dados do usuário no banco de dados
  const user = await User.findOne({ raw: true, where: {id:id}})

  // Renderizando o template 'useredit' com os dados do usuário para edição
  res.render('useredit', { user })
});

// Rota para atualizar os dados de um usuário (POST)
server.post('/users/update', async (req, res) => {
  const id = req.body.id // Pegando o ID do usuário do corpo da requisição
  const name = req.body.name // Pegando o nome atualizado do corpo da requisição
  const occpation = req.body.occpation // Pegando a ocupação atualizada
  let newsletter = req.body.newsletter // Pegando o valor de newsletter

  // Atualizando o valor de newsletter para booleano
  if(newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  // Dados do usuário atualizados
  const userData = {
    id: id,
    name: name,
    occpation: occpation,
    newsletter: newsletter
  }

  // Atualizando o usuário no banco de dados
  await User.update(userData, { where: { id: id } })

  res.redirect('/') // Após atualizar, redireciona para a página inicial
});

// Rota principal para exibir todos os usuários (GET)
server.get("/", async (req, res) => {
  // Buscando todos os usuários no banco de dados
  const users = await User.findAll({raw: true})

  console.log(users) // Exibindo os usuários no console (para depuração)

  // Renderizando o template 'home' e passando os usuários para o template
  res.render('home', { users: users });
});

// Conectando ao banco de dados e iniciando o servidor
conn
  .sync() // Sincroniza o banco de dados (garante que as tabelas existam)
  .then(() => {
    // Inicia o servidor na porta definida
    server.listen(port, () => {
      console.log(`servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err)); // Caso haja erro na conexão com o banco de dados, exibe no console
