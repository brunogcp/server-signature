<div align="center">
  <h3 align="center">Cryptography</h3>
  <div>
  <a href="https://bgcp.vercel.app/article/0b99ce80-0dd6-4b3f-8e96-f509474c0ae4">
  <img src="https://img.shields.io/badge/Download PDF (ENGLISH)-black?style=for-the-badge&logoColor=white&color=000000" alt="three.js" />
  </a>
  </div>
</div>

## 🚀 Introdução à Assinatura Digital com Node.js

Neste tutorial, vamos explorar como implementar assinaturas digitais em Node.js para garantir a autenticidade das mensagens enviadas pelo servidor. A assinatura digital é fundamental para verificar se a mensagem recebida pelo cliente foi realmente enviada pelo servidor e se ela permaneceu intacta durante a transmissão. Este método é amplamente utilizado em comunicações seguras, autenticação de documentos, e em várias outras aplicações que requerem verificação de integridade e autenticidade.

### 🌟 Principais Características:

- **🔒 Segurança Aprimorada**: A assinatura digital adiciona uma camada de segurança, assegurando que a mensagem é autêntica.
- **✅ Integridade de Dados**: Garante que a mensagem não foi alterada.
- **🔏 Autenticidade**: Confirma a identidade do remetente.
- **📈 Não-repúdio**: O remetente não pode negar a autoria da mensagem assinada.

## 🛠️ Instalação

Para este tutorial, você precisa ter o Node.js instalado. A boa notícia é que utilizaremos o módulo `crypto`, que já vem embutido no Node.js, então não há necessidade de instalações adicionais.

## 📊 Uso Básico

Vamos começar criando um script simples para gerar um par de chaves (pública e privada), assinar uma mensagem com a chave privada e, em seguida, verificar essa assinatura com a chave pública. Este processo demonstra a essência da assinatura digital.

### 🛠️ Gerando o Par de Chaves, Assinando e Verificando Mensagens

1. **Criar um Script para Assinatura Digital**:

Salve o seguinte código em um arquivo, por exemplo, `digitalSignature.js`. Este script ilustra como gerar um par de chaves, assinar uma mensagem e verificar a assinatura:

```js
const { generateKeyPair, createSign, createVerify } = require('crypto');

// Gerar par de chaves RSA
generateKeyPair('rsa', {
    modulusLength: 2048, // 🛠️ Tamanho da chave
}, (err, publicKey, privateKey) => {
    if (err) {
        console.error('Erro ao gerar as chaves 🔑:', err);
        return;
    }

    // Mensagem a ser assinada
    const message = "Mensagem secreta 🤫";

    // Criar assinatura
    const sign = createSign('sha256');
    sign.update(message); // 📝 Atualiza a mensagem a ser assinada
    sign.end(); // 🏁 Finaliza o input da mensagem

    const signature = sign.sign(privateKey, 'base64'); // 🔏 Assina com a chave privada
    console.log('Assinatura: 📜', signature);

    // Verificar assinatura
    const verify = createVerify('sha256');
    verify.update(message); // 📝 Atualiza com a mesma mensagem
    verify.end(); // 🏁 Finaliza o input da mensagem

    // 🕵️‍♂️ Verifica se a assinatura é válida com a chave pública
    const isValid = verify.verify(publicKey, signature, 'base64');
    console.log('A assinatura é válida? ✅❌', isValid ? 'Sim ✅' : 'Não ❌');
});
```

2. **Executar o Script**:

Abra um terminal, navegue até o diretório onde você salvou o arquivo `digitalSignature.js` e execute o seguinte comando:

```bash
node digitalSignature.js
```

Você verá a assinatura gerada no console, seguida pela confirmação de que a assinatura é válida.


### 📈 Assinatura Digital para Autenticidade de Mensagens

### Teoria da Assinatura Digital:

💡 A assinatura digital utiliza algoritmos de criptografia assimétrica para gerar um resumo criptográfico da mensagem, que é então assinado usando a chave privada do remetente. O receptor pode verificar esta assinatura com a chave pública do remetente, assegurando assim a autenticidade da mensagem.

### Motivo para Utilizar Assinatura Digital:

🚀 Utilizar a assinatura digital assegura que as mensagens recebidas são autênticas e não foram alteradas, aumentando a segurança na comunicação entre servidor e cliente.

### Implementação da Assinatura Digital:

👨‍💻 Criando um sistema de autenticação de mensagens com Node.js.

Entendi, vamos expandir o tutorial para incluir a geração das chaves, salvando-as em arquivos, e utilizando-as tanto no backend quanto no frontend para a assinatura e verificação de mensagens.

## Parte 1: Backend em Node.js

### Geração e Armazenamento das Chaves

Primeiramente, vamos gerar o par de chaves e salvá-las em arquivos separados.

1. **Crie um script para gerar as chaves**:

Nomeie o arquivo como `generateKeys.js` e adicione o seguinte código:

```javascript
const { generateKeyPair } = require('crypto');
const fs = require('fs');
const path = require('path');

generateKeyPair('rsa', {
    modulusLength: 2048, // Tamanho da chave
}, (err, publicKey, privateKey) => {
    if (err) {
        console.error('Erro ao gerar as chaves:', err);
        return;
    }

    // Salvando a chave pública
    fs.writeFileSync(path.join(__dirname, 'publicKey.pem'), publicKey);

    // Salvando a chave privada
    fs.writeFileSync(path.join(__dirname, 'privateKey.pem'), privateKey);

    console.log('Chaves geradas e salvas.');
});
```

2. **Execute o script para gerar e salvar as chaves**:

No terminal, navegue até o diretório do seu projeto backend e execute:

```bash
node generateKeys.js
```

Isso criará dois arquivos: `publicKey.pem` e `privateKey.pem`, contendo a chave pública e privada, respectivamente.

### Implementação do Servidor com Assinaturas Digitais

Agora que temos as chaves, vamos modificá-las `server.js` para assinar as informações usando a chave privada.

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const { createSign } = require('crypto');
const cors = require('cors')

const PORT = 3000;

const app = express();
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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

```

## Vamos ajustar o tutorial para incluir a rota de retorno da chave pública no backend e utilizar `crypto-js` no frontend para a verificação da assinatura.

## Parte 1: Backend em Node.js

Primeiro, instale `cors` e `express` no seu projeto:

```bash
npm install cors express
```


### Adicionando uma Rota para a Chave Pública

No seu arquivo `server.js`, adicione uma nova rota para servir a chave pública:

```javascript
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
```

## Parte 2: Frontend em React

Para o frontend, vamos atualizar o React para utilizar `crypto-js` para a decodificação da assinatura base64 e a verificação da assinatura com a chave pública obtida do backend.

### Componente `VerifyData.js`

Agora, vamos modificar o componente `VerifyData.js` para obter a chave pública do servidor e verificar a assinatura das informações recebidas:

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [dataStatus, setDataStatus] = useState("Dados não verificados.");
  const [message, setMessage] = useState("");

  // Função para buscar a chave pública do servidor
  const fetchPublicKey = async () => {
    try {
      const response = await axios.get('http://localhost:3000/public-key');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter a chave pública:', error);
    }
  };

  // Função para buscar os dados assinados do servidor
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Função para validar os dados usando a chave pública
  const validateData = async () => {
    const publicKey = await fetchPublicKey();
    const { data, signature } = await fetchData();

    // Enviar os dados e a assinatura para o servidor para validação
    const validationResponse = await axios.post('http://localhost:3000/validate-signature', {
      data: data,
      publicKey,
      signature: signature
    });

    const isValid = validationResponse;

    if (isValid) {
      setDataStatus("Dados verificados e seguros.");
      setMessage(data.message);
    } else {
      setDataStatus("Dados não são seguros.");
    }
  };

  return (
    <div className="App">
      <h1>Status dos Dados: {dataStatus}</h1>
      {message && <p>Mensagem do Servidor: {message}</p>}
      <button onClick={validateData}>Validar Autenticidade dos Dados</button>
    </div>
  );
}

export default App;
```

### 🔍 Testes:

1. **Envio e Verificação**:
    
    - Assine uma mensagem e envie-a junto com a assinatura.
    - O receptor usa a chave pública para verificar a assinatura e validar a mensagem.

## 🏆 Conclusão

A assinatura digital é uma ferramenta poderosa para garantir a segurança das comunicações digitais, oferecendo integridade, autenticidade e não-repúdio. Este tutorial forneceu um exemplo básico de como implementar assinaturas digitais em Node.js, demonstrando a geração de chaves, assinatura de mensagens e verificação de assinaturas. Implementar essas técnicas em suas aplicações pode significativamente aumentar a segurança e a confiabilidade das comunicações entre servidores e clientes. Continue explorando e implementando recursos de segurança para proteger suas aplicações! 🔐💻
