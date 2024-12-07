const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

async function createUser() {
  const uri = process.env.MONGODB_URI; // Certifique-se de que o .env contém o MONGODB_URI correto
  if (!uri) {
    console.error('Erro: MONGODB_URI não está definido no arquivo .env');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('cashhero');
    const usersCollection = db.collection('users');

    // Crie uma nova senha hash
    const password = '123456'; // A senha que você quer usar
    const hashedPassword = await bcrypt.hash(password, 10); // Hash com o bcrypt

    const newUser = {
      email: 'teste@teste.com',
      password: hashedPassword, // Armazene o hash
    };

    // Insira o novo usuário no banco de dados
    await usersCollection.insertOne(newUser);
    console.log('Usuário criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
  } finally {
    await client.close();
  }
}

createUser();
