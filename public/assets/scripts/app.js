const API_URL = "http://localhost:3000/conceitos"; // Endpoint para os conceitos no JSON Server
let dados = []; // Armazena os dados carregados

/**
 * 📚 Funções de Leitura (Read)
 */

// Função principal para carregar dados do servidor
async function carregarDados() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        dados = await resposta.json();
        // Chama as funções de renderização apenas após o carregamento bem-sucedido
        renderizarCards();
        renderizarDetalhes();
        // A função de renderizar a tabela/painel de controle precisa ser chamada aqui
        renderizarTabelaGerenciamento();

    } catch (erro) {
        console.error("❌ Erro ao carregar dados:", erro);
        // Exibe uma mensagem de erro na interface do usuário, se possível
    }
}

// Renderiza os cards na página inicial (index.html)
function renderizarCards() {
    const containerCards = document.getElementById('cards-container');

    if (containerCards) { // Verifica se estamos na página index.html
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

// Renderiza os detalhes de um item na página detalhes.html
function renderizarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const idItem = parseInt(urlParams.get('id'));
    const detalhesContainer = document.getElementById('detalhes-item');

    if (detalhesContainer && idItem) { // Verifica se estamos na página detalhes.html e se há um ID
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

// NOVO: Renderiza a tabela de gerenciamento (simulada aqui, precisa de um novo HTML)
function renderizarTabelaGerenciamento() {
    const tabelaBody = document.getElementById('tabela-conceitos-body');
    if (tabelaBody) {
        let htmlTabela = '';
        dados.forEach(item => {
            htmlTabela += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.titulo}</td>
                    <td>${item.categoria}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-2" onclick="prepararEdicao(${item.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deletarConceito(${item.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
        tabelaBody.innerHTML = htmlTabela;
    }
}

/**
 * ➕ Funções de Criação e Atualização (Create/Update)
 */

// NOVO: Configura o formulário para edição ou criação
function configurarFormulario() {
    const form = document.getElementById('conceito-form');
    if (form) {
        form.addEventListener('submit', lidarComEnvioDoFormulario);
    }
}

// NOVO: Preenche o formulário para edição
async function prepararEdicao(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`);
        const item = await resposta.json();

        document.getElementById('conceito-id').value = item.id;
        document.getElementById('titulo').value = item.titulo;
        document.getElementById('descricao').value = item.descricao;
        document.getElementById('conteudo').value = item.conteudo;
        document.getElementById('categoria').value = item.categoria;
        document.getElementById('sistema').value = item.sistema;
        document.getElementById('imagem').value = item.imagem;

        // Altera o botão para indicar Edição
        document.getElementById('btn-submit-form').textContent = 'Salvar Alterações';

        alert(`Preparando para editar: ${item.titulo}`); // Alerta visual para o teste
    } catch (error) {
        console.error("Erro ao preparar edição:", error);
    }
}

// NOVO: Lida com o envio do formulário (Criação ou Edição)
async function lidarComEnvioDoFormulario(evento) {
    evento.preventDefault();

    const id = document.getElementById('conceito-id').value;
    const novoOuAtualizado = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        conteudo: document.getElementById('conteudo').value,
        categoria: document.getElementById('categoria').value,
        sistema: document.getElementById('sistema').value,
        imagem: document.getElementById('imagem').value,
    };

    if (id) {
        // Se houver ID, é uma edição (PUT)
        await editarConceito(id, novoOuAtualizado);
    } else {
        // Se não houver ID, é uma criação (POST)
        await adicionarConceito(novoOuAtualizado);
    }

    // Limpa o formulário e reseta o botão
    evento.target.reset();
    document.getElementById('conceito-id').value = '';
    document.getElementById('btn-submit-form').textContent = 'Adicionar Conceito';
}


// Função para Adicionar um novo conceito (Create)
async function adicionarConceito(novo) {
    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novo)
        });
        if (!resposta.ok) {
            throw new Error(`Erro ao adicionar: ${resposta.status}`);
        }
        const data = await resposta.json();
        console.log("✅ Conceito adicionado:", data);
        alert(`Conceito "${data.titulo}" adicionado com sucesso!`);
        carregarDados(); // Recarrega os dados para atualizar a interface
    } catch (erro) {
        console.error("❌ Erro ao adicionar:", erro);
        alert(`Erro ao adicionar conceito. Verifique o console.`);
    }
}

// Função para Editar um conceito existente (Update)
async function editarConceito(id, atualizado) {
    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizado)
        });
        if (!resposta.ok) {
            throw new Error(`Erro ao atualizar: ${resposta.status}`);
        }
        const data = await resposta.json();
        console.log("✅ Conceito atualizado:", data);
        alert(`Conceito "${data.titulo}" (ID: ${id}) atualizado com sucesso!`);
        carregarDados(); // Recarrega os dados para atualizar a interface
    } catch (erro) {
        console.error("❌ Erro ao atualizar:", erro);
        alert(`Erro ao atualizar conceito. Verifique o console.`);
    }
}

/**
 * 🗑️ Função de Exclusão (Delete)
 */

// Função para Deletar um conceito (Delete)
async function deletarConceito(id) {
    if (!confirm(`Tem certeza que deseja deletar o conceito com ID ${id}?`)) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!resposta.ok) {
            throw new Error(`Erro ao deletar: ${resposta.status}`);
        }
        console.log(`✅ Conceito ${id} deletado.`);
        alert(`Conceito (ID: ${id}) deletado com sucesso!`);
        carregarDados(); // Recarrega os dados para atualizar a interface
    } catch (erro) {
        console.error("❌ Erro ao deletar:", erro);
        alert(`Erro ao deletar conceito. Verifique o console.`);
    }
}


// Inicialização: Carrega os dados e configura o formulário ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    configurarFormulario(); // Garante que o formulário seja configurado se estiver na página
});
