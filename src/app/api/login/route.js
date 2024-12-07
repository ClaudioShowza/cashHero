import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

// Função auxiliar para conectar ao MongoDB
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  // Conecta ao banco de dados
  await client.connect();
  
  return client;
}

export async function POST(req) {
  let client;
  
  try {
    const { email, password } = await req.json();
    console.log("Email recebido:", email);
    console.log("Senha recebida:", password);

    // Conecta ao banco de dados diretamente
    client = await connectToDatabase();
    const db = client.db("cashhero");

    // Busca o usuário no banco de dados
    const user = await db.collection("users").findOne({ email });
    console.log("Usuário encontrado:", user);

    if (!user) {
      console.log("Usuário não encontrado");
      return new Response(JSON.stringify({ message: "Usuario não encontrado" }), {
        status: 401,
      });
    }

    // Comparação da senha usando bcrypt
    const passwordMatches = await bcrypt.compare(password, user.password);
    console.log("Comparação de senha:", passwordMatches);

    if (passwordMatches) {
      console.log("Login bem-sucedido");
      return new Response(JSON.stringify({ message: "" }), {
        status: 200,
      });
    } else {
      console.log("Senha inválida");
      return new Response(JSON.stringify({ message: "Informações de login incorretas" }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  } finally {
    if (client) {
      await client.close();  // Garante que a conexão ao MongoDB seja fechada
    }
  }
}
