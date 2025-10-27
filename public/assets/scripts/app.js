const dados = [
    {
        "id": 1,
        "titulo": "Dados",
        "descricao": "Ferramenta essencial para definir os rumos da aventura e o sucesso ou falha das ações.",
        "conteudo": "Os dados de múltiplos lados (d4, d6, d8, d10, d12, d20) são usados para introduzir o elemento de sorte. Eles garantem que nem todas as ações sejam previsíveis, tornando o jogo emocionante.",
        "categoria": "Conceito Básico",
        "sistema": "Universal",
        "imagem": "assets/img/dadosrpg.jpg"
    },
    {
        "id": 2,
        "titulo": "Fichas",
        "descricao": "O registro completo de cada personagem: atributos, habilidades, equipamentos e história.",
        "conteudo": "A ficha é a representação física do personagem no jogo. É onde o jogador anota tudo, desde a força do seu herói até o número de moedas de ouro que ele possui. É vital para a continuidade da história.",
        "categoria": "Conceito Básico",
        "sistema": "Universal",
        "imagem": "assets/img/ficharpg.jpg"
    },
    {
        "id": 3,
        "titulo": "Narrador (Mestre)",
        "descricao": "Responsável por guiar a história, descrever o mundo e interpretar personagens secundários.",
        "conteudo": "Conhecido como Mestre (GM) ou Narrador, ele é o árbitro final das regras e o principal contador de histórias. Sem o Mestre, não há mundo para explorar nem aventuras para viver.",
        "categoria": "Função Essencial",
        "sistema": "Universal",
        "imagem": "assets/img/mestre.jpg"
    }
];

function renderizarCards() {
    const containerCards = document.getElementById('cards-container');

    if (containerCards) {
        let htmlCards = '';

        dados.forEach(item => {
            htmlCards += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 p-3 text-center">
                        <img src="${item.imagem}" class="card-img-top rounded mb-3" alt="${item.titulo}"> 
                        <h3 class="mb-2">${item.titulo}</h3>
                        <p>${item.descricao}</p>
                        <a href="detalhes.html?id=${item.id}" class="btn mt-auto" style="background-color: #9d4edd; color: #fff;">
                            Saiba Mais
                        </a>
                    </div>
                </div>
            `;
        });

        containerCards.innerHTML = htmlCards;
    }
}

function renderizarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const idItem = parseInt(urlParams.get('id'));

    const detalhesContainer = document.getElementById('detalhes-item');

    if (detalhesContainer && idItem) {
        const item = dados.find(d => d.id === idItem);

        if (item) {
            detalhesContainer.innerHTML = `
                <h2 class="mb-4 border-bottom pb-2" style="border-color:#9d4edd !important;">${item.titulo}</h2>
                <div class="row">
                    <div class="col-md-6 mb-4">
                        <img src="${item.imagem}" class="img-fluid rounded shadow" alt="Imagem de ${item.titulo}">
                    </div>
                    <div class="col-md-6">
                        <article class="artigo p-4 h-100">
                            <h3>${item.descricao}</h3>
                            <hr style="border-color:#9d4edd;">
                            <p class="lead">${item.conteudo}</p>
                            <p><strong>Categoria:</strong> ${item.categoria}</p>
                            <p><strong>Sistema/Conceito:</strong> ${item.sistema}</p>
                            <a href="index.html" class="btn mt-3" style="background-color: #d181ff; color: #121212;">
                                ← Voltar para a Home
                            </a>
                        </article>
                    </div>
                </div>
            `;
            document.title = `${item.titulo} - Role & Play`;

        } else {
            detalhesContainer.innerHTML = `<div class="alert alert-danger text-center" role="alert">Item não encontrado.</div>`;
        }
    }
}

renderizarCards();
renderizarDetalhes();