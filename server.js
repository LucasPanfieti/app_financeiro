// server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Caminho do arquivo JSON
const DB_PATH = "./database.json";

// Função auxiliar pra ler e salvar JSON
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ transacoes: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ===== ROTA LOGIN =====
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === "admin" && senha === "admin") {
    res.json({ sucesso: true });
  } else {
    res
      .status(401)
      .json({ sucesso: false, mensagem: "Usuário ou senha inválidos" });
  }
});

// ===== ROTAS DE TRANSACOES =====
app.get("/transacoes", (req, res) => {
  const db = readDB();
  res.json(db.transacoes);
});

app.post("/transacoes", (req, res) => {
  const db = readDB();
  const nova = { id: Date.now(), ...req.body };
  db.transacoes.push(nova);
  writeDB(db);
  res.json(nova);
});

app.delete("/transacoes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  db.transacoes = db.transacoes.filter((t) => t.id !== id);
  writeDB(db);
  res.json({ sucesso: true });
});

app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
