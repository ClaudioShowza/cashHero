import clientPromise from "../../../lib/mongo";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();
    console.log("Dados recebidos:", name, email, phone, password);

    if (!name || !email || !phone || !password) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("cashhero");
    const usersCollection = db.collection("users");

    // Verifique se o usuário já existe
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Usuario já cadastrado" }), {
        status: 409,
      });
    }

    // Hash a senha com bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crie um novo usuário com os dados adicionais
    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
    };

    // Insira o usuário no banco de dados
    const result = await usersCollection.insertOne(newUser);
    return new Response(JSON.stringify({ message: "Usuario foi criado com sucesso!" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao criar o usuário:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
