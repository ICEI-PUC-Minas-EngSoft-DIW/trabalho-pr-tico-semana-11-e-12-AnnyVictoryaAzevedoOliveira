const API_URL = "http://localhost:3000/conceitos";
let dados = [];

async function carregarDados() {
    try {
        const resposta = await fetch(API_URL);
        dados = await resposta.json();
        renderizarCards();
        renderizarDetalhes();
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

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

async function adicionarConceito(novo) {
    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novo)
        });
        const data = await resposta.json();
        console.log("Conceito adicionado:", data);
        carregarDados();
    } catch (erro) {
        console.error("Erro ao adicionar:", erro);
    }
}

async function editarConceito(id, atualizado) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizado)
        });
        const data = await resposta.json();
        console.log("Conceito atualizado:", data);
        carregarDados();
    } catch (erro) {
        console.error("Erro ao atualizar:", erro);
    }
}

async function deletarConceito(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        console.log(`Conceito ${id} deletado.`);
        carregarDados();
    } catch (erro) {
        console.error("Erro ao deletar:", erro);
    }
}


carregarDados();
