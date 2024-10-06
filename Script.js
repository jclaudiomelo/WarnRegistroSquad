   // Capturar a imagem colada
   document.addEventListener('paste', function (event) {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = "300px"; // Limitar o tamanho da imagem exibida
                document.getElementById('image-container').innerHTML = '';
                document.getElementById('image-container').appendChild(img);
                // Armazenar a imagem em um campo global para envio posterior
                window.pastedImage = blob;
            };
            reader.readAsDataURL(blob);
        }
    }
});

document.getElementById('discordForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Pegando o valor do campo de informação
    const info = document.getElementById('info').value.trim();
    const selectedRules = Array.from(document.getElementById('rules').selectedOptions)
        .map(option => option.value);

    // Verificar se o campo foi preenchido
    if (!info) {
        alert('Por favor, cole as informações no formato correto: Nome ID Steam');
        return;
    }

    // Separar o nome e o ID Steam
    const idsteam = info.match(/\d{17}/);  // ID Steam deve ter 17 dígitos
    const nome = info.replace(/\d+/g, '').trim();  // Remover números para pegar o nome

    // Verificações de validação
    if (!idsteam || !nome) {
        alert('Por favor, cole as informações no formato correto: Nome seguido por ID Steam.');
        return;
    }

    if (selectedRules.length === 0) {
        alert('Por favor, selecione pelo menos uma regra.');
        return;
    }

    // URL do Webhook do Discord
    // const webhookUrl = 'https://discord.com/api/webhooks/1292261056009211955/4RLY5IBt0KAswGRgdPtzGn83U3gM6HUyvHvI3UGMIPumlfJmzmWDf-MWD-_wBEV7rDnp';
    const webhookUrl = 'https://discord.com/api/webhooks/1292285380384657489/aveyIRn8wZWdG7YB35C7gz-p-lIaX4pCmoGLhyBLYKwl02XFdldLULe_oRR3pERr5LEk';
    // Corpo da mensagem em formato JSON
    const data = {
        content: `**Nome:** ${nome}\n**ID Steam:** ${idsteam[0]}\n**Regras Violadas:** ${selectedRules.join(', ')}`
    };

    // Enviar a imagem para o webhook do Discord
    const formData = new FormData();
    formData.append('payload_json', JSON.stringify(data));
    formData.append('file', window.pastedImage, 'screenshot.jpg'); // Enviar a imagem como arquivo

    // Fazendo uma requisição POST para o Webhook
    fetch(webhookUrl, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            alert('Dados enviados com sucesso!');
            document.getElementById('discordForm').reset();
            document.getElementById('image-container').innerHTML = ''; // Limpa a imagem
            window.pastedImage = null; // Limpa a imagem armazenada
        } else {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
    }).catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar os dados: ' + error.message);
    });
});