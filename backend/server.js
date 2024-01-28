const express = require('express');
const fs = require('fs');
const path = require('path');
const { createSign, createVerify  } = require('crypto');
const cors = require('cors')

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors())

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'privateKey.pem'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, 'publicKey.pem'), 'utf8');

// Rota para dados assinados
app.get('/data', (req, res) => {
  const data = { message: "Informações confidenciais do servidor" };

  const sign = createSign('sha256');
  sign.update(JSON.stringify(data));
  sign.end();
  const signature = sign.sign(PRIVATE_KEY, 'base64');

  res.json({ data, signature });
});

// Rota para servir a chave pública
app.get('/public-key', (req, res) => {
  res.send(PUBLIC_KEY);
});

app.post('/validate-signature', (req, res) => {
  const { data, signature, publicKey } = req.body;

  // Converte os dados de volta para string, se necessário
  const dataString = JSON.stringify(data);

  const verify = createVerify('sha256');
  verify.update(dataString);
  verify.end();

  // A assinatura precisa ser convertida de Base64 para formato binário
  const isSignatureValid = verify.verify(publicKey, signature, 'base64');

  if (isSignatureValid) {
    res.json({ valid: true, message: "A assinatura é válida." });
  } else {
    res.status(400).json({ valid: false, message: "A assinatura é inválida." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});