require('dotenv').config();  // Adicione essa linha no início do arquivo
const { MongoClient } = require("mongodb");

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;  // Pegue a string de conexão do arquivo .env
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Tente conectar ao MongoDB
    await client.connect();
    console.log("Conectado ao MongoDB com sucesso!");

    // Teste para garantir que a conexão está funcionando
    const db = client.db("cashhero");
    const collections = await db.listCollections().toArray();
    console.log("Coleções disponíveis:", collections);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  } finally {
    await client.close();
  }
}

connectToDatabase();
