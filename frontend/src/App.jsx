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
