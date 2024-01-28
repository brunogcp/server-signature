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

    // Salvando a chave pública em formato PEM
    fs.writeFileSync(path.join(__dirname, 'publicKey.pem'), publicKey.export({
        type: 'pkcs1',
        format: 'pem'
    }));

    // Salvando a chave privada em formato PEM
    fs.writeFileSync(path.join(__dirname, 'privateKey.pem'), privateKey.export({
        type: 'pkcs1',
        format: 'pem'
    }));

    console.log('Chaves geradas e salvas.');
});
