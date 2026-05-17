let logged = false;
let isAdmin = false;
let cart = [];
let selectedProduct = null;
let selSize = "";
let currentDiscountPercent = 0; // Armazena a porcentagem atual de desconto ativo

// Lista de usuários cadastrados (O admin já começa cadastrado aqui)
let usuariosCadastrados = [
    { name: "Administrador D'Avila", email: "admin@davila.com", password: "123456", role: "Administrador", img: "img/logo.png" }
];

// Objeto base do Usuário do Sistema Logado
let currentUser = {
    name: "",
    email: "",
    role: "",
    img: "img/avatar-cliente.png"
};

let produtos = [
    { id: 1, name: "Jaqueta Varsity", price: 499.90, img: "img/produto.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 12 },
    { id: 2, name: "Moletom Performance", price: 279.90, img: "img/moletom-liso.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8 },
    { id: 3, name: "Calça Moletom Performance", price: 299.90, img: "img/moletom.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8 },
    { id: 4, name: "Camiseta Essential", price: 229.90, img: "img/camisa-azul.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 9 },
    { id: 5, name: "Camiseta Essential", price: 229.90, img: "img/camisa-preta.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 12 },
    { id: 6, name: "Camiseta Essential", price: 229.90, img: "img/camisa-cinza.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8  },  
    { id: 7, name: "Camiseta Essential", price: 229.90, img: "img/camisa-branca.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 10  },
    { id: 8, name: "Shorts Performance", price: 149.90, img: "img/shorts.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 4  },
    { id: 9, name: "Tênis Urban Fit", price: 359.90, img: "img/produtos.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8 },
    { id: 10, name: "Boné Fit", price: 99.90, img: "img/bone.png", sizes: ["P", "M", "G", "GG", "XG"], stock: 8 }
];

let equipe = [
    { id: 1, name: "Carlos Silveira", role: "Gerente" },
    { id: 2, name: "Ana Beatriz", role: "Supervisor" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderStaff();
    initChart();
    updateNavigation();
});

// --- CONTROLE DOS POP-UPS (MODAIS) ---
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

// Altera a abertura do login para sempre resetar na tela de login
function openLogin() { 
    closeNotLoggedModal(); 
    toggleAuthMode('login');
    document.getElementById("loginModal").classList.add("active"); 
}

function closeLogin() { 
    document.getElementById("loginModal").classList.remove("active"); 
}

// Função para alternar visualmente entre o formulário de Login e o de Cadastro
function toggleAuthMode(mode) {
    const loginArea = document.getElementById("login-form-area");
    const registerArea = document.getElementById("register-form-area");
    
    if (mode === 'register') {
        loginArea.style.display = "none";
        registerArea.style.display = "block";
    } else {
        loginArea.style.display = "block";
        registerArea.style.display = "none";
    }
}

// --- FUNÇÃO DE CADASTRO DE NOVO USUÁRIO ---
function registerUser() {
    let name = document.getElementById("reg-name").value.trim();
    let email = document.getElementById("reg-email").value.trim();
    let password = document.getElementById("reg-password").value.trim();

    if (!name || !email || !password) {
        return alert("Por favor, preencha todos os campos para se cadastrar!");
    }

    // Verifica se o e-mail já foi usado
    let emailExiste = usuariosCadastrados.some(user => user.email === email);
    if (emailExiste) {
        return alert("Este e-mail já está cadastrado!");
    }

    // Adiciona o novo cliente na lista do sistema
    usuariosCadastrados.push({
        name: name,
        email: email,
        password: password,
        role: "Cliente",
        img: "img/avatar-cliente.png"
    });

    alert("Cadastro realizado com sucesso! Agora você pode fazer o seu login.");
    
    // Limpa os campos do cadastro
    document.getElementById("reg-name").value = "";
    document.getElementById("reg-email").value = "";
    document.getElementById("reg-password").value = "";
    
    // Volta para a tela de login automaticamente
    toggleAuthMode('login');
}

// --- FUNÇÃO DE LOGIN ATUALIZADA (Busca na lista dinâmica) ---
function login() {
    let emailInput = document.getElementById("email").value.trim();
    let passwordInput = document.getElementById("password").value.trim();

    // Procura o usuário digitado dentro da nossa lista do sistema
    let usuarioEncontrado = usuariosCadastrados.find(user => user.email === emailInput && user.password === passwordInput);

    if (usuarioEncontrado) {
        logged = true;
        isAdmin = (usuarioEncontrado.role === "Administrador");

        // Passa as informações encontradas para o perfil logado
        currentUser.name = usuarioEncontrado.name;
        currentUser.email = usuarioEncontrado.email;
        currentUser.role = usuarioEncontrado.role;
        currentUser.img = usuarioEncontrado.img;

        // Atualiza a foto da Nav Bar se ela existir
        let navImg = document.getElementById("nav-profile-img");
        if (navImg) {
            navImg.src = currentUser.img;
        }

        // Se for admin, ativa as permissões visuais do painel
        if (isAdmin) {
            document.getElementById("admin").classList.add("active");
            closeLogin();
            alert(`Bem-vindo, ${currentUser.name}!`);
        } else {
            closeLogin();
            alert(`Login efetuado com sucesso! Bem-vindo(a), ${currentUser.name}.`);
        }

        // Limpa os campos do login
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        updateNavigation();
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

function updateNavigation() {
    const navLinks = document.getElementById("nav-links");
    if (!navLinks) return;
    
    let htmlContent = `
        <li><a href="#">Home</a></li>
        <li><a href="#produtos">Produtos</a></li>
        <li><a href="#feed">Feed</a></li>
    `;
    if (logged && isAdmin) {
        htmlContent += `<li><a href="#admin" style="color: #2f6fff; font-weight: bold;">Painel ADM</a></li>`;
    }
    navLinks.innerHTML = htmlContent;
}

function updateProfileUI() {
    const container = document.getElementById("profile-pop-content");
    if (!container) return;

    let navImg = document.getElementById("nav-profile-img");
    if (navImg) {
        navImg.src = currentUser.img;
    }

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

// --- CONTROLE DE POSIÇÕES / REORDENAÇÃO ---
function moveProductUp(index) {
    if (index === 0) return; 
    let temp = produtos[index];
    produtos[index] = produtos[index - 1];
    produtos[index - 1] = temp;
    renderProducts();
}

function moveProductDown(index) {
    if (index === produtos.length - 1) return; 
    let temp = produtos[index];
    produtos[index] = produtos[index + 1];
    produtos[index + 1] = temp;
    renderProducts();
}

// --- PRODUTOS E VITRINE ---
function renderProducts() {
    const container = document.getElementById("products-container");
    const adminList = document.getElementById("admin-product-list");
    if(!container || !adminList) return;

    container.innerHTML = ""; adminList.innerHTML = "";
    produtos.forEach((p, index) => {
        let promoBadgeHtml = currentDiscountPercent > 0 ? `<div class="promo-badge-tag">-${currentDiscountPercent}% OFF</div>` : '';

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
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:#1a1a1a; margin-bottom:6px; border-radius:8px; font-size:13px; border: 1px solid #252525;">
            <div style="display:flex; align-items:center;">
                <div class="order-actions">
                    <button class="order-btn" onclick="moveProductUp(${index})">▲</button>
                    <button class="order-btn" onclick="moveProductDown(${index})">▼</button>
                </div>
                <span style="font-weight:500; margin-left:5px;">${p.name}</span>
            </div>
            <button class="delete-btn-adm" onclick="produtos.splice(${index},1); renderProducts()">×</button>
        </div>`;
    });
    renderStockUI();
}

function addNewProduct() {
    let name = document.getElementById("newProdName").value;
    let price = parseFloat(document.getElementById("newProdPrice").value);
    let sizes = document.getElementById("newProdSizes").value.split(",").map(i => i.trim());
    let img = document.getElementById("newProdImg").value || "img/produtos.png";

    if (name && price && sizes[0]) {
        produtos.push({ id: Date.now(), name, price, img, sizes, stock: 0 });
        renderProducts();
        document.getElementById("newProdName").value = "";
        document.getElementById("newProdPrice").value = "";
        document.getElementById("newProdSizes").value = "";
    } else {
        alert("Preencha os dados do produto corretamente!");
    }
}

// --- CONTROLE DE PROMOÇÃO ---
function applyGlobalPromo() {
    let inputVal = parseFloat(document.getElementById("promoPercent").value);
    
    if(inputVal > 0 && inputVal <= 100) {
        currentDiscountPercent = inputVal; 
        let pct = inputVal / 100;
        
        produtos.forEach(p => p.price *= (1 - pct));
        renderProducts();
        
        let badge = document.getElementById("active-promo-badge");
        if (badge) {
            badge.innerText = `${currentDiscountPercent}% Ativo`;
        }
        document.getElementById("promoPercent").value = "";
        alert(`Desconto global de ${currentDiscountPercent}% aplicado com sucesso!`);
    } else {
        alert("Insira uma porcentagem válida entre 1 e 100!");
    }
}

// --- COMPRA E ESTOQUE ---
function triggerPurchaseModal(index) {
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
    
    let totalProfit = document.getElementById("total-profit");
    if (totalProfit) {
        totalProfit.innerText = "R$ " + total.toFixed(2);
    }
}

function removeFromCart(cartId) {
    const idx = cart.findIndex(i => i.cartId === cartId);
    if(idx > -1) {
        const prod = produtos.find(p => p.id === cart[idx].id);
        if(prod) prod.stock++;
        cart.splice(idx, 1);
        updateCartUI();
        renderProducts();
    }
}

function renderStockUI() {
    const select = document.getElementById("stockProductSelect");
    const lowStockList = document.getElementById("low-stock-list");
    if(!select || !lowStockList) return;
    select.innerHTML = ""; lowStockList.innerHTML = "";
    produtos.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.name} (Atual: ${p.stock} un)</option>`;
        let status = p.stock <= 4 ? `<span class="badge-low">Crítico: ${p.stock} un</span>` : `<span class="badge-ok">${p.stock} un</span>`;
        lowStockList.innerHTML += `<div class="stock-item-status"><span>${p.name}</span>${status}</div>`;
    });
}

function addStock() {
    const pId = document.getElementById("stockProductSelect").value;
    const qty = parseInt(document.getElementById("stockQuantityInput").value);
    if(!qty || qty <= 0) return alert("Quantidade inválida!");
    const prod = produtos.find(p => p.id == pId);
    if(prod) { prod.stock += qty; renderProducts(); document.getElementById("stockQuantityInput").value = ""; }
}

// --- EQUIPE ---
function addStaff() {
    let n = document.getElementById("workerName").value.trim();
    let r = document.getElementById("workerRole").value.trim();
    if(n && r) { equipe.push({ id: Date.now(), name: n, role: r }); renderStaff(); document.getElementById("workerName").value=""; document.getElementById("workerRole").value=""; }
}

function renderStaff() {
    const list = document.getElementById("staff-list");
    if(!list) return; list.innerHTML = "";
    equipe.forEach(m => {
        list.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:#1a1a1a; margin-bottom:6px; border-radius:8px; font-size:13px; border: 1px solid #252525;">
            <div><strong style="color:#fff;">${m.name}</strong> - <small style="color:#aaa;">${m.role}</small></div>
            <button class="delete-btn-adm" onclick="equipe=equipe.filter(e=>e.id!=${m.id}); renderStaff()">×</button>
        </div>`;
    });
}

function initChart() {
    const ctx = document.getElementById('salesChart'); if(!ctx) return;
    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'], datasets: [{ label: 'Vendas (R$)', data: [500, 1200, 800, 1500, 2100], borderColor: '#2f6fff', tension: 0.4 }] },
        options: { plugins: { legend: { labels: { color: '#fff' } } } }
    });
}
