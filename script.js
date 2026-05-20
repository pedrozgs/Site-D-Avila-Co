// ==========================================
// BANCO DE DADOS SIMULADO (LOCALSTORAGE)
// ==========================================
function salvarBanco() {
    localStorage.setItem("davila_produtos", JSON.stringify(produtos));
    localStorage.setItem("davila_equipe", JSON.stringify(equipe));
    localStorage.setItem("davila_usuarios", JSON.stringify(usuariosCadastrados));
    localStorage.setItem("davila_vendas", JSON.stringify(relatorioVendas));
    localStorage.setItem("davila_estoque_log", JSON.stringify(relatorioMovimentacaoEstoque));
    localStorage.setItem("davila_pedidos", JSON.stringify(pedidosGerais));
}

function carregarBanco() {
    if(localStorage.getItem("davila_produtos")) produtos = JSON.parse(localStorage.getItem("davila_produtos"));
    if(localStorage.getItem("davila_equipe")) equipe = JSON.parse(localStorage.getItem("davila_equipe"));
    if(localStorage.getItem("davila_usuarios")) usuariosCadastrados = JSON.parse(localStorage.getItem("davila_usuarios"));
    if(localStorage.getItem("davila_vendas")) relatorioVendas = JSON.parse(localStorage.getItem("davila_vendas"));
    if(localStorage.getItem("davila_estoque_log")) relatorioMovimentacaoEstoque = JSON.parse(localStorage.getItem("davila_estoque_log"));
    if(localStorage.getItem("davila_pedidos")) pedidosGerais = JSON.parse(localStorage.getItem("davila_pedidos"));
}

let logged = false;
let isAdmin = false;
let isFuncionario = false;
let cart = [];
let selectedProduct = null;
let selSize = "";
let currentDiscountPercent = 0;
let salesChartInstance = null; // Guardará a instância do gráfico para permitir atualizações em tempo real

// Dados Base Iniciais (Serão gravados se o banco estiver vazio)
let usuariosCadastrados = [
    { name: "Administrador D'Avila", email: "admin@davila.com", password: "123456", role: "Administrador", img: "img/logo.png" },
    { name: "Carlos Silveira", email: "gerente@davila.com", password: "123456", role: "Gerente", img: "img/logo.png" },
    { name: "Operador de Estoque", email: "func@davila.com", password: "123456", role: "Funcionário", img: "img/avatar-cliente.png" }
];

let currentUser = { name: "", email: "", role: "", img: "img/avatar-cliente.png" };

let produtos = [
    { id: 1, name: "Jaqueta Varsity", price: 359.90, img: "img/produto.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 12, individualDiscount: 0 },
    { id: 2, name: "Moletom Performance", price: 279.90, img: "img/moletom-liso.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8, individualDiscount: 0 },
    { id: 3, name: "Calça Moletom Performance", price: 299.90, img: "img/moletom.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8, individualDiscount: 0 },
    { id: 4, name: "Camiseta Essential Blue", price: 229.90, img: "img/camisa-azul.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 9, individualDiscount: 0 },
    { id: 5, name: "Camiseta Essential Black", price: 229.90, img: "img/camisa-preta.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 12, individualDiscount: 0 },
    { id: 6, name: "Camiseta Essential Grey", price: 229.90, img: "img/camisa-cinza.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8, individualDiscount: 0  },  
    { id: 7, name: "Camiseta Essential White", price: 229.90, img: "img/camisa-branca.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 10, individualDiscount: 0  },
    { id: 8, name: "Shorts Performance", price: 149.90, img: "img/shorts.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 4, individualDiscount: 0  },
    { id: 9, name: "Tênis Urban Fit", price: 499.00, img: "img/produtos.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8, individualDiscount: 0  },
    { id: 10, name: "Boné Fit", price: 99.90, img: "img/bone.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 5, individualDiscount: 0  }
];

let equipe = [
    { id: 1, name: "Carlos Silveira", role: "Gerente", email: "gerente@davila.com", password: "1234" },
    { id: 2, name: "Ana Beatriz", role: "Supervisor", email: "ana@davila.com", password: "1234" }
];

let relatorioVendas = [];
let relatorioMovimentacaoEstoque = [];
let pedidosGerais = [];

let avaliacoesEstaticas = [
    { nome: "Mariana S.", nota: 5, texto: "Melhor caimento plus size que já comprei! Super confortável para treinar." },
    { nome: "Roberto J.", nota: 4, texto: "A jaqueta varsity é linda e muito quente. Entrega rápida." },
    { nome: "Paula A.", nota: 5, texto: "Tecido tecnológico maravilhoso, não enrola nas pernas durante os exercícios." }
];

document.addEventListener("DOMContentLoaded", () => {
    if(!localStorage.getItem("davila_produtos")) {
        salvarBanco();
    } else {
        carregarBanco();
    }
    renderProducts();
    renderStaff();
    initChart();
    updateNavigation();
    renderAvaliacoes();
    iniciarCarrosselAutomatico();
    verificarFormularioAvaliacao();
});

function iniciarCarrosselAutomatico() {
    const track = document.getElementById("carouselTrack");
    let index = 0;
    setInterval(() => {
        index++;
        if (index >= 8) index = 0;
        if(track) track.style.transform = `translateX(-${index * 12.5}%)`;
    }, 3000);
}

function renderAvaliacoes() {
    const container = document.getElementById("reviews-list-container");
    if (!container) return;
    container.innerHTML = "";
    avaliacoesEstaticas.forEach(av => {
        let estrelas = "★".repeat(av.nota) + "☆".repeat(5 - av.nota);
        container.innerHTML += `
            <div class="review-card">
                <div class="review-stars">${estrelas}</div>
                <strong>${av.nome}</strong>
                <p style="color:#aaa; font-size:14px; margin-top:5px;">"${av.texto}"</p>
            </div>
        `;
    });
}

function verificarFormularioAvaliacao() {
    const boxForm = document.getElementById("escrever-avaliacao-container");
    if(!boxForm) return;

    if(logged) {
        boxForm.innerHTML = `
            <div class="admin-card" style="background:#111; border:1px solid #222; padding:20px; border-radius:10px; text-align:left;">
                <h3 style="color:#2f6fff; margin-bottom:10px;">Conte-nos sua experiência, ${currentUser.name}!</h3>
                <div style="display:flex; gap:15px; margin-bottom:10px; flex-wrap:wrap;">
                    <div style="flex:1; min-width:150px;">
                        <label class="field-label">Sua Nota</label>
                        <select id="nova-av-nota" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:white; border-radius:6px;">
                            <option value="5">★★★★★ (5 Estrelas)</option>
                            <option value="4">★★★★☆ (4 Estrelas)</option>
                            <option value="3">★★★☆☆ (3 Estrelas)</option>
                            <option value="2">★★☆☆☆ (2 Estrelas)</option>
                            <option value="1">★☆☆☆☆ (1 Estrela)</option>
                        </select>
                    </div>
                </div>
                <label class="field-label">Comentário</label>
                <input type="text" id="nova-av-texto" placeholder="Escreva aqui detalhes sobre o produto recebido..." style="width:100%; padding:12px; background:#000; border:1px solid #333; color:white; border-radius:8px; margin-bottom:12px;">
                <button onclick="adicionarNovaAvaliacaoUsuario()" style="padding:10px 20px; background:#2f6fff; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Publicar Avaliação</button>
            </div>
        `;
    } else {
        boxForm.innerHTML = `
            <div style="background:#161616; padding:15px; border-radius:8px; text-align:center; border: 1px dashed #333;">
                <p style="color:#888; font-size:14px;">Você precisa estar <a href="#" onclick="openLogin()" style="color:#2f6fff; font-weight:bold; text-decoration:none;">logado em sua conta</a> para deixar uma avaliação.</p>
            </div>
        `;
    }
}

function adicionarNovaAvaliacaoUsuario() {
    const nota = parseInt(document.getElementById("nova-av-nota").value);
    const texto = document.getElementById("nova-av-texto").value.trim();
    if(!texto) return alert("Por favor, digite um texto para a sua avaliação!");

    avaliacoesEstaticas.unshift({ nome: currentUser.name, nota: nota, texto: texto });
    document.getElementById("nova-av-texto").value = "";
    alert("Obrigado! Sua avaliação foi publicada com sucesso.");
    renderAvaliacoes();
}

function triggerPurchaseModal(index) {
    if (!logged) {
        document.getElementById("notLoggedModal").classList.add("active");
        return;
    }
    selectedProduct = produtos[index];
    selSize = "";
    document.getElementById("modal-product-name").innerText = selectedProduct.name;
    const sizeCont = document.getElementById("size-options");
    sizeCont.innerHTML = "";
    selectedProduct.sizes.forEach(s => {
        sizeCont.innerHTML += `<button class="opt-btn" onclick="selectSizeOpt(this)">${s}</button>`;
    });
    document.getElementById("purchaseModal").classList.add("active");
}

// =================================================================
// FUNÇÃO DE LOGIN ADAPTADA PARA IDENTIFICAR PERFIS DINAMICAMENTE
// =================================================================
function login() {
    let emailInput = document.getElementById("email").value.trim();
    let passwordInput = document.getElementById("password").value.trim();

    let usuarioEncontrado = usuariosCadastrados.find(user => user.email === emailInput && user.password === passwordInput);

    if(!usuarioEncontrado) {
        let membroEquipe = equipe.find(eq => eq.email === emailInput && eq.password === passwordInput);
        if(membroEquipe) {
            usuarioEncontrado = { 
                name: membroEquipe.name, 
                email: membroEquipe.email, 
                password: membroEquipe.password, 
                role: membroEquipe.role, 
                img: "img/avatar-cliente.png" 
            };
        }
    }

    if (usuarioEncontrado) {
        logged = true;
        
        isAdmin = (usuarioEncontrado.role === "Administrador" || usuarioEncontrado.role === "Gerente");
        isFuncionario = (usuarioEncontrado.role === "Funcionário" || usuarioEncontrado.role === "Supervisor");

        currentUser.name = usuarioEncontrado.name;
        currentUser.email = usuarioEncontrado.email;
        currentUser.role = usuarioEncontrado.role;
        currentUser.img = usuarioEncontrado.img;

        if (document.getElementById("nav-profile-img")) {
            document.getElementById("nav-profile-img").src = currentUser.img;
        }

        closeLogin();
        alert(`Conectado com sucesso!\nPerfil: ${currentUser.name}\nCargo: ${currentUser.role}`);
        
        updateNavigation();
        verificarFormularioAvaliacao();
        
        if(isAdmin || isFuncionario) {
            abrirModoPainelSeparado();
        }
    } else {
        alert("Credenciais inválidas! Verifique o e-mail e a senha.");
    }
}

// =================================================================
// CONTROLE DE TELAS BASEADO NO PERFIL LOGADO
// =================================================================
function abrirModoPainelSeparado() {
    document.getElementById("site-view").style.display = "none";
    document.getElementById("panel-view").style.display = "block";
    document.getElementById("user-logged-panel-name").innerText = `Logado como: ${currentUser.name} [${currentUser.role}]`;
    
    const tabsContainer = document.getElementById("panelTabsContainer");
    tabsContainer.innerHTML = "";

    if (currentUser.role === "Administrador" || currentUser.role === "Gerente") {
        tabsContainer.innerHTML = `<button class="tab-btn active" onclick="switchTab('admin')">Painel Geral Gerência / Administração</button>`;
        switchTab('admin');
    } else if (currentUser.role === "Funcionário" || currentUser.role === "Supervisor") {
        tabsContainer.innerHTML = `<button class="tab-btn active" onclick="switchTab('funcionarios')">Módulo de Operações Funcionário</button>`;
        switchTab('funcionarios');
    }
    
    atualizarRelatoriosELists();
}

function switchTab(target) {
    document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
    if(target === 'admin') document.getElementById("tab-conteudo-admin").classList.add("active");
    if(target === 'funcionarios') document.getElementById("tab-conteudo-funcionarios").classList.add("active");
}

function logoutPainel() {
    document.getElementById("panel-view").style.display = "none";
    document.getElementById("site-view").style.display = "block";
}

// =================================================================
// SISTEMA DE DUAS ETAPAS COM ENDEREÇO SEPARADO POR CAMPOS
// =================================================================
function abrirModalCheckoutDados() {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    
    document.getElementById("cart").classList.remove("active");
    
    const modal = document.getElementById("checkoutDetailsModal");
    modal.classList.add("active");

    const inputEnderecoOriginal = document.getElementById("checkout-endereco");
    const selectPagamento = document.getElementById("checkout-pagamento");
    
    if (inputEnderecoOriginal && selectPagamento) {
        const containerEnderecoOriginal = inputEnderecoOriginal.parentElement;
        const containerPagamento = selectPagamento.parentElement;
        
        containerEnderecoOriginal.style.display = "none";
        containerPagamento.style.display = "none";
        
        const blocoSeparadoAntigo = modal.querySelector(".endereco-separado-block");
        if(blocoSeparadoAntigo) blocoSeparadoAntigo.remove();
        const navAntigo = modal.querySelector(".checkout-nav-step-btns");
        if(navAntigo) navAntigo.remove();

        let blocoSeparado = document.createElement("div");
        blocoSeparado.className = "endereco-separado-block";
        blocoSeparado.style.display = "block";
        blocoSeparado.style.textAlign = "left";

        blocoSeparado.innerHTML = `
            <div style="margin-bottom: 12px;">
                <label class="field-label" style="display:block; margin-bottom:5px; font-size:13px; color:#888;">Rua / Logradouro</label>
                <input type="text" id="chk-rua" placeholder="Ex: Av. Paulista" style="width:100%; padding:12px; background:#000; border:1px solid #333; color:white; border-radius:8px;">
            </div>
            <div style="display:flex; gap:10px; margin-bottom: 12px;">
                <div style="flex: 1;">
                    <label class="field-label" style="display:block; margin-bottom:5px; font-size:13px; color:#888;">Número</label>
                    <input type="text" id="chk-numero" placeholder="Ex: 123" style="width:100%; padding:12px; background:#000; border:1px solid #333; color:white; border-radius:8px;">
                </div>
                <div style="flex: 2;">
                    <label class="field-label" style="display:block; margin-bottom:5px; font-size:13px; color:#888;">Bairro</label>
                    <input type="text" id="chk-bairro" placeholder="Ex: Centro" style="width:100%; padding:12px; background:#000; border:1px solid #333; color:white; border-radius:8px;">
                </div>
            </div>
            <div style="margin-bottom: 15px;">
                <label class="field-label" style="display:block; margin-bottom:5px; font-size:13px; color:#888;">Cidade</label>
                <input type="text" id="chk-cidade" placeholder="Ex: São Paulo" style="width:100%; padding:12px; background:#000; border:1px solid #333; color:white; border-radius:8px;">
            </div>
        `;

        containerPagamento.parentNode.insertBefore(blocoSeparado, containerPagamento);

        let btnFinalizar = modal.querySelector("button[onclick='processarCompraFinal()']");
        if (btnFinalizar) {
            btnFinalizar.style.display = "none"; 

            let navBox = document.createElement("div");
            navBox.className = "checkout-nav-step-btns";
            navBox.style.display = "flex";
            navBox.style.gap = "10px";
            navBox.style.marginTop = "15px";

            let btnAvancar = document.createElement("button");
            btnAvancar.innerText = "Avançar para Pagamento ➔";
            btnAvancar.className = "checkout-btn";
            btnAvancar.style.background = "#2f6fff";
            btnAvancar.style.color = "#fff";
            btnAvancar.style.width = "100%";

            let btnVoltar = document.createElement("button");
            btnVoltar.innerText = "⬅ Voltar";
            btnVoltar.className = "checkout-btn";
            btnVoltar.style.background = "#333";
            btnVoltar.style.color = "#fff";
            btnVoltar.style.display = "none";

            btnAvancar.onclick = function() {
                let rua = document.getElementById("chk-rua").value.trim();
                let num = document.getElementById("chk-numero").value.trim();
                let bairro = document.getElementById("chk-bairro").value.trim();
                let cidade = document.getElementById("chk-cidade").value.trim();

                if(!rua || !num || !bairro || !cidade) {
                    return alert("Por favor, preencha todos os campos da entrega (Rua, Número, Bairro e Cidade)!");
                }

                inputEnderecoOriginal.value = `${rua}, Nº ${num} - Bairro: ${bairro} - ${cidade}`;

                blocoSeparado.style.display = "none";
                containerPagamento.style.display = "block";
                btnVoltar.style.display = "block";
                btnAvancar.style.display = "none";
                btnFinalizar.style.display = "block"; 
            };

            btnVoltar.onclick = function() {
                blocoSeparado.style.display = "block";
                containerPagamento.style.display = "none";
                btnVoltar.style.display = "none";
                btnAvancar.style.display = "block";
                btnFinalizar.style.display = "none";
            };

            navBox.appendChild(btnVoltar);
            navBox.appendChild(btnAvancar);
            btnFinalizar.parentNode.insertBefore(navBox, btnFinalizar);
        }
    }
}

function processarCompraFinal() {
    let endereco = document.getElementById("checkout-endereco").value.trim();
    let pagamento = document.getElementById("checkout-pagamento").value;
    if(!endereco) return alert("Por favor preencha o endereço para a entrega!");

    let totalPedido = 0;
    let itensNomes = cart.map(i => {
        totalPedido += i.price;
        relatorioMovimentacaoEstoque.push({ data: new Date().toLocaleDateString(), tipo: "SAÍDA (Venda)", produto: i.name, qtd: 1 });
        return `${i.name} (${i.size})`;
    }).join(', ');

    let codPedido = Math.floor(1000 + Math.random() * 9000);

    // Mapeamento para identificar o dia da semana atual da venda
    const diasSemanaMap = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    let diaDaSemanaAtual = diasSemanaMap[new Date().getDay()];

    let novoPedido = {
        id: codPedido,
        cliente: currentUser.name,
        produtos: itensNomes,
        total: totalPedido,
        endereco: endereco,
        formaPagamento: pagamento,
        status: "Aguardando Separação",
        data: new Date().toLocaleDateString(),
        diaSemana: diaDaSemanaAtual // Gravamos o dia da semana para leitura estruturada do gráfico
    };

    pedidosGerais.push(novoPedido);
    relatorioVendas.push(novoPedido);

    salvarBanco();
    alert(`Pedido #${codPedido} Realizado com sucesso!\nForma de Pagamento: ${pagamento}`);
    
    cart = [];
    updateCartUI();
    document.getElementById("checkout-endereco").value = "";
    document.getElementById("checkoutDetailsModal").classList.remove("active");
    
    const blocoSeparadoAntigo = document.querySelector(".endereco-separado-block");
    if(blocoSeparadoAntigo) blocoSeparadoAntigo.remove();
    const navAntigo = document.querySelector(".checkout-nav-step-btns");
    if(navAntigo) navAntigo.remove();
    
    atualizarRelatoriosELists();
    initChart(); // Atualiza os dados visuais do gráfico dinamicamente com a nova venda
}

function atualizarRelatoriosELists() {
    const admVendasText = document.getElementById("adm-report-vendas-text");
    const funcVendasText = document.getElementById("func-report-vendas-text");
    const admPagamentosText = document.getElementById("adm-report-pagamentos-text");
    const admEstoqueText = document.getElementById("adm-report-estoque-text");
    const funcPedidosList = document.getElementById("func-pedidos-separacao");
    const funcEstoqueList = document.getElementById("func-estoque-list");
    const admEstoqueRealtimeList = document.getElementById("adm-estoque-realtime-list");

    let faturamentoTotal = relatorioVendas.reduce((acc, curr) => acc + curr.total, 0);
    let totalPedidosQtd = relatorioVendas.length;

    let stringVendas = `TOTAL DE PEDIDOS: ${totalPedidosQtd} | FATURAMENTO MENSAL: R$ ${faturamentoTotal.toFixed(2)}\n\n`;
    relatorioVendas.forEach(v => {
        stringVendas += `[${v.data}] Pedido #${v.id} - ${v.cliente} - R$ ${v.total.toFixed(2)} (${v.status})\nItens: ${v.produtos}\n\n`;
    });

    if(admVendasText) admVendasText.innerText = stringVendas || "Nenhum registro encontrado.";
    if(funcVendasText) funcVendasText.innerText = stringVendas || "Nenhum registro encontrado.";

    let stringPagamentos = "FATURAMENTO POR MEIO DE PAGAMENTO:\n\n";
    ['Pix', 'Crédito', 'Débito'].forEach(meio => {
        let sub = relatorioVendas.filter(v => v.formaPagamento === meio).reduce((a,c) => a+c.total, 0);
        stringPagamentos += `${meio}: R$ ${sub.toFixed(2)}\n`;
    });
    if(admPagamentosText) admPagamentosText.innerText = stringPagamentos;

    let stringEstoque = "";
    relatorioMovimentacaoEstoque.forEach(m => {
        stringEstoque += `[${m.data}] ${m.tipo} -> ${m.produto} (Qtd: ${m.qtd})\n`;
    });
    if(admEstoqueText) admEstoqueText.innerText = stringEstoque || "Sem movimentações recentes.";

    if(funcPedidosList) {
        funcPedidosList.innerHTML = "";
        pedidosGerais.forEach((p, idx) => {
            funcPedidosList.innerHTML += `
                <div style="background:#050505; padding:12px; margin-bottom:8px; border-radius:6px; border:1px solid #222;">
                    <strong>Pedido #${p.id} - Cliente: ${p.cliente}</strong><br>
                    <small style="color:#2f6fff;">Destino: ${p.endereco}</small><br>
                    <p style="margin:5px 0; color:#aaa;">Itens: ${p.produtos}</p>
                    <p style="margin-bottom:8px; font-size:12px; color:#00ff88;">Valor Total: R$ ${p.total.toFixed(2)}</p>
                    <div style="display:flex; gap:10px;">
                        <button class="checkout-btn" style="padding:6px; font-size:12px; background:#00ff88; color:#000; flex:1;" onclick="despacharPedido(${idx})">Marcar como Entregue</button>
                        <button class="checkout-btn" style="padding:6px; font-size:12px; background:#ffca28; color:#000; flex:1;" onclick="baixarFichaSeparacaoPDF(${idx})">📄 Baixar Ficha de Separação (PDF)</button>
                    </div>
                </div>
            `;
        });
        if(pedidosGerais.length === 0) funcPedidosList.innerHTML = "Nenhum pedido aguardando separação.";
    }

    if(admEstoqueRealtimeList) {
        admEstoqueRealtimeList.innerHTML = "";
        produtos.forEach(p => {
            admEstoqueRealtimeList.innerHTML += `
                <div class="stock-item-status">
                    <span>${p.name}</span>
                    <span class="${p.stock <= 4 ? 'badge-low' : 'badge-ok'}">${p.stock} un</span>
                </div>
            `;
        });
    }

    if(funcEstoqueList) {
        funcEstoqueList.innerHTML = "";
        produtos.forEach(p => {
            funcEstoqueList.innerHTML += `
                <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #222; font-size:13px;">
                    <span>${p.name}</span>
                    <span style="font-weight:bold; color:${p.stock <= 4 ? '#ff4444' : '#00ff88'}">${p.stock} un</span>
                </div>
            `;
        });
    }
}

function despacharPedido(index) {
    alert(`Pedido #${pedidosGerais[index].id} despachado com sucesso!`);
    pedidosGerais.splice(index, 1);
    salvarBanco();
    atualizarRelatoriosELists();
}

// ==========================================
// EXPORTAÇÃO DOS RELATÓRIOS EM PDF REAL
// ==========================================
function downloadRelatorioPDF(tipo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let titulo = "";
    let conteudo = "";

    if(tipo === 'vendas') {
        titulo = "D'AVILA STORE - RELATORIO DE VENDAS MENSAIS";
        conteudo = document.getElementById("adm-report-vendas-text").innerText;
    } else if(tipo === 'pagamentos') {
        titulo = "D'AVILA STORE - METODOS DE PAGAMENTO E FATURAMENTO";
        conteudo = document.getElementById("adm-report-pagamentos-text").innerText;
    } else if(tipo === 'estoque') {
        titulo = "D'AVILA STORE - FLUXO E HISTORICO DE ESTOQUE";
        conteudo = document.getElementById("adm-report-estoque-text").innerText;
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text(titulo, 14, 20);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    
    let linhas = doc.splitTextToSize(conteudo, 180);
    doc.text(linhas, 14, 32);
    
    doc.save(`relatorio-${tipo}-${Date.now()}.pdf`);
}

function baixarFichaSeparacaoPDF(index) {
    const pedido = pedidosGerais[index];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.rect(10, 10, 190, 120); 
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FICHA DE SEPARAÇÃO E ETIQUETA DE ENVIO", 15, 22);
    doc.line(15, 26, 195, 26);

    doc.setFontSize(12);
    doc.text(`CÓDIGO DO PEDIDO: #${pedido.id}`, 15, 36);
    doc.text(`DATA: ${pedido.data}`, 140, 36);

    doc.setFont("Helvetica", "bold");
    doc.text("DADOS DO CLIENTE:", 15, 48);
    doc.setFont("Helvetica", "normal");
    doc.text(`Nome: ${pedido.cliente}`, 15, 54);
    
    let linhasEndereco = doc.splitTextToSize(`Local de Entrega: ${pedido.endereco}`, 170);
    doc.text(linhasEndereco, 15, 62);

    doc.setFont("Helvetica", "bold");
    doc.text("ITENS PARA SEPARAÇÃO NO ESTOQUE:", 15, 82);
    doc.setFont("Helvetica", "normal");
    doc.text(`Produtos: ${pedido.produtos}`, 15, 88);

    doc.line(15, 105, 195, 105);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`PREÇO TOTAL: R$ ${pedido.total.toFixed(2)}`, 15, 115);
    doc.text(`PAGAMENTO: ${pedido.formaPagamento}`, 110, 115);

    doc.save(`ficha-separacao-pedido-${pedido.id}.pdf`);
}

function addStaff() {
    let n = document.getElementById("workerName").value.trim();
    let r = document.getElementById("workerRole").value;
    let e = document.getElementById("workerEmail").value.trim();
    let p = document.getElementById("workerPassword").value.trim();

    if(n && r && e && p) {
        equipe.push({ id: Date.now(), name: n, role: r, email: e, password: p });
        usuariosCadastrados.push({ name: n, email: e, password: p, role: r, img: "img/avatar-cliente.png" });
        
        salvarBanco();
        renderStaff();
        document.getElementById("workerName").value=""; 
        document.getElementById("workerEmail").value="";
        document.getElementById("workerPassword").value="";
        alert(`Membro ${n} (${r}) cadastrado com sucesso!`);
        
        atualizarRelatoriosELists();
    } else {
        alert("Preencha todos os dados do funcionário para login.");
    }
}

function addStock() {
    const pId = document.getElementById("stockProductSelect").value;
    const qty = parseInt(document.getElementById("stockQuantityInput").value);
    if(!qty || qty <= 0) return alert("Quantidade inválida!");
    const prod = produtos.find(p => p.id == pId);
    if(prod) { 
        prod.stock += qty; 
        relatorioMovimentacaoEstoque.push({ data: new Date().toLocaleDateString(), tipo: "ENTRADA (Manual)", produto: prod.name, qtd: qty });
        salvarBanco();
        renderProducts(); 
        document.getElementById("stockQuantityInput").value = ""; 
        atualizarRelatoriosELists();
    }
}

function applySingleProductPromo() {
    const pId = document.getElementById("singlePromoProductSelect").value;
    const discountVal = parseFloat(document.getElementById("singlePromoPercent").value);
    const managerEmail = document.getElementById("managerPromoEmail").value.trim();
    const managerPass = document.getElementById("managerPromoPassword").value.trim();

    if(!pId || isNaN(discountVal) || discountVal <= 0 || discountVal > 100) {
        return alert("Insira uma porcentagem de desconto válida (1 a 100).");
    }

    const gerenteValido = equipe.find(e => e.email === managerEmail && e.password === managerPass && e.role.toLowerCase() === "gerente");

    if(!gerenteValido) {
        return alert("Acesso Negado: Apenas um usuário com cargo de 'Gerente' cadastrado na equipe pode autorizar esta promoção.");
    }

    const prod = produtos.find(p => p.id == pId);
    if(prod) {
        prod.price = prod.price * (1 - (discountVal / 100));
        prod.individualDiscount = discountVal;
        salvarBanco();
        alert(`Sucesso! Desconto de ${discountVal}% aplicado ao produto "${prod.name}" com a chancela do Gerente ${gerenteValido.name}.`);
        
        document.getElementById("singlePromoPercent").value = "";
        document.getElementById("managerPromoEmail").value = "";
        document.getElementById("managerPromoPassword").value = "";
        
        renderProducts();
    }
}

function handleProfileClick() {
    document.getElementById("cart").classList.remove("active");
    if (logged) {
        updateProfileUI();
        document.getElementById("profileModal").classList.add("active");
    } else {
        document.getElementById("notLoggedModal").classList.add("active");
    }
}
function closeProfileModal() { document.getElementById("profileModal").classList.remove("active"); }
function openNotLoggedModal() { document.getElementById("notLoggedModal").classList.add("active"); }
function closeNotLoggedModal() { document.getElementById("notLoggedModal").classList.remove("active"); }
function openCart() { document.getElementById("cart").classList.toggle("active"); }
function openLogin() { closeNotLoggedModal(); toggleAuthMode('login'); document.getElementById("loginModal").classList.add("active"); }
function closeLogin() { document.getElementById("loginModal").classList.remove("active"); }
function toggleAuthMode(mode) {
    const loginArea = document.getElementById("login-form-area");
    const registerArea = document.getElementById("register-form-area");
    if (mode === 'register') { loginArea.style.display = "none"; registerArea.style.display = "block"; } 
    else { loginArea.style.display = "block"; registerArea.style.display = "none"; }
}
function registerUser() {
    let name = document.getElementById("reg-name").value.trim();
    let email = document.getElementById("reg-email").value.trim();
    let password = document.getElementById("reg-password").value.trim();
    if (!name || !email || !password) return alert("Preencha todos os campos!");
    usuariosCadastrados.push({ name, email, password, role: "Cliente", img: "img/avatar-cliente.png" });
    salvarBanco();
    alert("Cadastro efetuado!");
    toggleAuthMode('login');
}
function updateNavigation() {
    const navLinks = document.getElementById("nav-links");
    if (!navLinks) return;
    let htmlContent = `<li><a href="#">Home</a></li><li><a href="#produtos">Produtos</a></li><li><a href="#avaliacoes">Avaliações</a></li>`;
    if (logged && (isAdmin || isFuncionario)) {
        htmlContent += `<li><a href="#" onclick="abrirModoPainelSeparado()" style="color: #2f6fff; font-weight: bold;">Acessar Painel Corporativo</a></li>`;
    }
    navLinks.innerHTML = htmlContent;
}
function updateProfileUI() {
    const container = document.getElementById("profile-pop-content");
    if (!container) return;
    container.innerHTML = `
        <div class="user-profile-box">
            <img src="${currentUser.img}" alt="Avatar">
            <h3>${currentUser.name}</h3>
            <p>${currentUser.email}</p>
            <span class="role-badge">${currentUser.role}</span>
        </div>
        <button class="checkout-btn" style="background: #ff4444; margin-top:15px;" onclick="location.reload()">Sair da Conta</button>
    `;
}
function selectSizeOpt(btn) {
    btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selSize = btn.innerText;
}
function closePurchaseModal() { document.getElementById("purchaseModal").classList.remove("active"); }
function confirmAdd() {
    if(!selSize) return alert("Selecione um tamanho!");
    if(selectedProduct.stock <= 0) return alert("Produto sem estoque disponível!");
    cart.push({ cartId: Date.now(), id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, size: selSize });
    selectedProduct.stock--; 
    salvarBanco();
    updateCartUI();
    renderProducts();
    closePurchaseModal();
}
function updateCartUI() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = ""; let total = 0;
    cart.forEach(item => {
        total += item.price;
        cartList.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #222;">
            <div><strong>${item.name}</strong><br><small style="color:#888;">Tam: ${item.size}</small></div>
            <div style="display:flex; align-items:center; gap:12px;">
                <span style="font-weight:600;">R$ ${item.price.toFixed(2)}</span>
                <button class="remove-cart-item" onclick="removeFromCart(${item.cartId})">×</button>
            </div>
        </div>`;
    });
    document.getElementById("total").innerText = total.toFixed(2);
    document.getElementById("cart-count").innerText = cart.length;
}
function removeFromCart(cartId) {
    const idx = cart.findIndex(i => i.cartId === cartId);
    if(idx > -1) {
        const prod = produtos.find(p => p.id === cart[idx].id);
        if(prod) {
            prod.stock++;
            relatorioMovimentacaoEstoque.push({ data: new Date().toLocaleDateString(), tipo: "ESTORNO (Remoção)", produto: prod.name, qtd: 1 });
        }
        cart.splice(idx, 1);
        salvarBanco();
        updateCartUI();
        renderProducts();
        atualizarRelatoriosELists();
        initChart(); // Recalcula o gráfico caso um item seja removido/estornado
    }
}
function moveProductUp(index) { if (index === 0) return; let temp = produtos[index]; produtos[index] = produtos[index - 1]; produtos[index - 1] = temp; salvarBanco(); renderProducts(); }
function moveProductDown(index) { if (index === produtos.length - 1) return; let temp = produtos[index]; produtos[index] = produtos[index + 1]; produtos[index + 1] = temp; salvarBanco(); renderProducts(); }

function renderProducts() {
    const container = document.getElementById("products-container");
    const adminList = document.getElementById("admin-product-list");
    if(!container || !adminList) return;
    container.innerHTML = ""; adminList.innerHTML = "";
    
    produtos.forEach((p, index) => {
        let activeDiscount = Math.max(currentDiscountPercent, p.individualDiscount || 0);
        let promoBadgeHtml = activeDiscount > 0 ? `<div class="promo-badge-tag">-${activeDiscount}% OFF</div>` : '';
        
        container.innerHTML += `
        <div class="product">
            ${promoBadgeHtml}
            <img src="${p.img}" class="product-image">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">R$ ${p.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="triggerPurchaseModal(${index})">Comprar</button>
            </div>
        </div>`;
        
        adminList.innerHTML += `
        <div>
            <div style="display:flex; align-items:center;">
                <div class="order-actions">
                    <button class="order-btn" onclick="moveProductUp(${index})">▲</button>
                    <button class="order-btn" onclick="moveProductDown(${index})">▼</button>
                </div>
                <span style="font-weight:500; margin-left:5px;">${p.name}</span>
            </div>
            <button class="delete-btn-adm" onclick="produtos.splice(${index},1); salvarBanco(); renderProducts()">×</button>
        </div>`;
    });
    
    const select = document.getElementById("stockProductSelect");
    if(select) {
        select.innerHTML = "";
        produtos.forEach(p => { select.innerHTML += `<option value="${p.id}">${p.name} (Atual: ${p.stock} un)</option>`; });
    }

    const singleSelect = document.getElementById("singlePromoProductSelect");
    if(singleSelect) {
        singleSelect.innerHTML = "";
        produtos.forEach(p => { select.innerHTML += `<option value="${p.id}">${p.name} (R$ ${p.price.toFixed(2)})</option>`; });
    }
    
    atualizarRelatoriosELists();
}

function addNewProduct() {
    let name = document.getElementById("newProdName").value;
    let price = parseFloat(document.getElementById("newProdPrice").value);
    let sizes = document.getElementById("newProdSizes").value.split(",").map(i => i.trim());
    let img = document.getElementById("newProdImg").value || "img/produtos.png";
    if (name && price && sizes[0]) {
        produtos.push({ id: Date.now(), name, price, img, sizes, stock: 0, individualDiscount: 0 });
        salvarBanco();
        renderProducts();
        document.getElementById("newProdName").value = ""; document.getElementById("newProdPrice").value = ""; document.getElementById("newProdSizes").value = "";
    }
}
function applyGlobalPromo() {
    let inputVal = parseFloat(document.getElementById("promoPercent").value);
    if(inputVal > 0 && inputVal <= 100) {
        currentDiscountPercent = inputVal;
        produtos.forEach(p => p.price *= (1 - (inputVal / 100)));
        salvarBanco();
        renderProducts();
        if(document.getElementById("active-promo-badge")) document.getElementById("active-promo-badge").innerText = `${currentDiscountPercent}% Ativo`;
        document.getElementById("promoPercent").value = "";
    }
}
function renderStaff() {
    const list = document.getElementById("staff-list"); if(!list) return; list.innerHTML = "";
    equipe.forEach(m => {
        list.innerHTML += `
        <div>
            <div><strong style="color:#fff;">${m.name}</strong> - <small style="color:#aaa;">${m.role}</small></div>
            <button class="delete-btn-adm" onclick="equipe=equipe.filter(e=>e.id!=${m.id}); salvarBanco(); renderStaff()">×</button>
        </div>`;
    });
}

// ==========================================
// SISTEMA GRÁFICO TOTALMENTE DINÂMICO
// ==========================================
function initChart() {
    const ctx = document.getElementById('salesChart'); 
    if(!ctx) return;

    // Estruturas base vazias para receber o somatório por dia da semana
    const diasSemanaLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const faturamentoPorDia = [0, 0, 0, 0, 0, 0, 0];
    const qtdVendasPorDia = [0, 0, 0, 0, 0, 0, 0];

    // Varre o banco de relatorioVendas e popula os dias correspondentes
    relatorioVendas.forEach(venda => {
        let labelDia = venda.diaSemana || "Seg"; // Fallback caso vendas antigas não possuam a tag
        let indexDia = diasSemanaLabels.indexOf(labelDia);
        if(indexDia !== -1) {
            faturamentoPorDia[indexDia] += venda.total;
            qtdVendasPorDia[indexDia] += 1;
        }
    });

    // Se um gráfico já existia na tela, nós destruímos ele para renderizar as novas linhas de dados limpas
    if (salesChartInstance) {
        salesChartInstance.destroy();
    }

    salesChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: { 
            labels: diasSemanaLabels, 
            datasets: [
                { 
                    label: 'Ganhos Totais (R$)', 
                    data: faturamentoPorDia, 
                    borderColor: '#00ff88', // Linha verde para dinheiro/ganhos
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                { 
                    label: 'Quantidade de Vendas', 
                    data: qtdVendasPorDia, 
                    borderColor: '#2f6fff', // Linha azul para volume de pedidos
                    backgroundColor: 'rgba(47, 111, 255, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1',
                    borderDash: [5, 5] // Estilo tracejado para diferenciar visualmente
                }
            ] 
        },
        options: { 
            responsive: true,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Faturamento (R$)', color: '#fff' },
                    ticks: { color: '#fff' },
                    grid: { color: '#222' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Volume de Pedidos', color: '#fff' },
                    ticks: { color: '#fff', stepSize: 1 },
                    grid: { drawOnChartArea: false } // Não mistura as grades de fundo
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: '#222' }
                }
            },
            plugins: { 
                legend: { 
                    labels: { color: '#fff', font: { weight: 'bold' } } 
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.datasetIndex === 0) {
                                label += 'R$ ' + context.parsed.y.toFixed(2);
                            } else {
                                label += context.parsed.y + ' un';
                            }
                            return label;
                        }
                    }
                }
            } 
        }
    });
}
