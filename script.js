var rotacaoAtual = 0;

// Eventos para atualizar a visualização e rotação
document.getElementById('zpl-input').addEventListener('input', atualizarPrevia);
document.getElementById('rotate').addEventListener('click', rotacionarEtiqueta);

// Funções de exportação
document.getElementById('downloadZpl').addEventListener('click', exportarZpl);
document.getElementById('downloadPng').addEventListener('click', exportarPng);

// Atualização dos campos de largura e altura em cm
document.getElementById('label-width').addEventListener('input', atualizarPrevia);
document.getElementById('label-height').addEventListener('input', atualizarPrevia);

// Função para atualizar a pré-visualização da etiqueta
function atualizarPrevia() {
    var zplCode = document.getElementById('zpl-input').value;
    var labelPreview = document.getElementById('label-preview');
    var labelPreviewContainer = document.getElementById('label-preview-container');
    
    var labelWidth = parseFloat(document.getElementById('label-width').value);
    var labelHeight = parseFloat(document.getElementById('label-height').value);

    // Converter de cm para pixels (37.79px por cm como fator de conversão)
    var widthInPixels = (labelWidth * 37.79).toFixed(2);
    var heightInPixels = (labelHeight * 37.79).toFixed(2);

    // Ajusta o tamanho da visualização de acordo com os valores de largura e altura
    labelPreview.style.width = `${widthInPixels}px`;
    labelPreview.style.height = `${heightInPixels}px`;

    // Ajusta também o tamanho do contêiner de pré-visualização
    labelPreviewContainer.style.width = `${widthInPixels}px`;
    labelPreviewContainer.style.height = `${heightInPixels}px`;

    // Encoda o código ZPL e faz a chamada à API Labelary para renderizar a etiqueta
    var encodedZPL = encodeURIComponent(zplCode);
    var labelaryURL = `https://api.labelary.com/v1/printers/8dpmm/labels/${(labelWidth * 0.393701).toFixed(2)}x${(labelHeight * 0.393701).toFixed(2)}/0/${encodedZPL}`;

    fetch(labelaryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
            return response.blob();
        })
        .then(blob => {
            var objectURL = URL.createObjectURL(blob);
            labelPreview.src = objectURL;
        })
        .catch(error => {
            console.error('Erro ao tentar carregar a pré-visualização:', error);
            labelPreview.alt = "Erro ao carregar a pré-visualização da etiqueta.";
        });
}

// Função para rotacionar a etiqueta
function rotacionarEtiqueta() {
    var labelPreview = document.getElementById('label-preview');
    var labelPreviewContainer = document.getElementById('label-preview-container');

    // Incrementa a rotação em 90 graus
    rotacaoAtual = (rotacaoAtual + 90) % 360;

    // Atualiza o CSS da rotação
    labelPreview.style.transform = `rotate(${rotacaoAtual}deg)`;

    // Ajusta o tamanho do contêiner com base na rotação
    var labelWidth = parseFloat(document.getElementById('label-width').value);
    var labelHeight = parseFloat(document.getElementById('label-height').value);

    // Converter de cm para pixels
    var widthInPixels = (labelWidth * 37.79).toFixed(2);
    var heightInPixels = (labelHeight * 37.79).toFixed(2);

    // Se estiver rotacionado em 90 ou 270 graus, inverte a largura e a altura
    if (rotacaoAtual === 90 || rotacaoAtual === 270) {
        // Inverte as dimensões e ajusta as proporções corretamente
        labelPreviewContainer.style.width = `${heightInPixels}px`;
        labelPreviewContainer.style.height = `${widthInPixels}px`;

        labelPreview.style.width = `${heightInPixels}px`;
        labelPreview.style.height = `${widthInPixels}px`;
    } else {
        // Retorna as dimensões originais para a orientação horizontal
        labelPreviewContainer.style.width = `${widthInPixels}px`;
        labelPreviewContainer.style.height = `${heightInPixels}px`;

        labelPreview.style.width = `${widthInPixels}px`;
        labelPreview.style.height = `${heightInPixels}px`;
    }
}

// Função para exportar o ZPL
function exportarZpl() {
    var zplCode = document.getElementById('zpl-input').value;
    var blob = new Blob([zplCode], { type: 'text/plain' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'label.zpl';
    link.click();
}

// Função para exportar a imagem PNG
function exportarPng() {
    var labelImage = document.getElementById('label-preview').src;
    var link = document.createElement('a');
    link.href = labelImage;
    link.download = 'label.png';
    link.click();
}
