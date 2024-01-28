const { generateKeyPair, createSign, createVerify  } = require('crypto');

generateKeyPair('rsa', {
    modulusLength: 2048, // Tamanho da chave
}, (err, publicKey, privateKey) => {
    if (err) {
        console.error(err);
        return;
    }
    const PUBLICKEY = publicKey;
    const PRIVATEKEY = privateKey;

    // Mensagem a ser assinada
    const message = "Mensagem secreta";

    // Criar assinatura
    const sign = createSign('sha256');
    sign.update(message);
    sign.end();

    const signature = sign.sign(PRIVATEKEY, 'base64');
    console.log('Assinatura:', signature);

    const verify = createVerify('sha256');
    verify.update(message);
    verify.end();

    const isValid = verify.verify(publicKey, signature, 'base64');
    console.log('A assinatura é válida?', isValid ? 'Sim' : 'Não');
});
