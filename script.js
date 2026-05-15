let logged = false;
let isAdmin = false;
let currentUser = { email: "" };
let cart = [];
let totalVendas = 0;
let selectedProduct = null;
let selectedSizeLabel = "";

let produtos = [
    { id: 1, name: "Jaqueta Varsity", price: 499.90, img: "img/produto.png" },
    { id: 2, name: "Moletom Performance", price: 279.90, img: "img/moletom-liso.png" },
    { id: 3, name: "Calça Moletom Performance", price: 299.90, img: "img/moletom.png" },
    { id: 4, name: "Camiseta Essential", price: 229.90, img: "img/camisa-azul.png" },
    { id: 5, name: "Camiseta Essential", price: 229.90, img: "img/camisa-preta.png" },
    { id: 6, name: "Camiseta Essential", price: 229.90, img: "img/camisa-cinza.png" },  
    { id: 7, name: "Camiseta Essential", price: 229.90, img: "img/camisa-branca.png" },
    { id: 8, name: "Shorts Performance", price: 149.90, img: "img/shorts.png" },
    { id: 8, name: "Tênis Urban Fit", price: 459.90, img: "img/produtos.png" },
    { id: 8, name: "Boné Fit", price: 159.90, img: "img/bone.png" }
    
];

let equipe = [
    { name: "Carlos Silveira", role: "Gerente" },
    { name: "Ana Julia", role: "Vendas" }
];

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderStaff();
    initChart();
});

// --- LOGIN E NAVEGAÇÃO ---
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if(!email || !password) return alert("Preencha os campos!");

    logged = true;
    currentUser.email = email;

    if (email === "admin@davila.com" && password === "123456") {
        isAdmin = true;
        document.getElementById("admin").classList.add("active");
    }
    updateNavbar();
    closeLogin();
}

function logout() {
    location.reload();
}

function updateNavbar() {
    const authBox = document.getElementById("auth-buttons");
    authBox.innerHTML = `
        <button class="icon-btn" onclick="openProfile()">👤 Perfil</button>
        <button class="icon-btn" onclick="openCart()">
            🛒 <span class="cart-badge" id="cart-count">${cart.length}</span>
        </button>
    `;
}

// --- MODAIS ---
function openLogin() { document.getElementById("loginModal").classList.add("active"); }
function closeLogin() { document.getElementById("loginModal").classList.remove("active"); }
function openCart() { document.getElementById("cart").classList.toggle("active"); }
function openProfile() {
    const info = document.getElementById("user-info");
    info.innerHTML = `<strong>E-mail:</strong> ${currentUser.email}<br><strong>Status:</strong> ${isAdmin ? "Admin" : "Cliente VIP"}`;
    document.getElementById("profileModal").classList.add("active");
}
function closeProfile() { document.getElementById("profileModal").classList.remove("active"); }

// --- LOGICA DE PRODUTOS ---
function renderProducts() {
    const container = document.getElementById("products-container");
    const adminList = document.getElementById("admin-product-list");
    if(!container || !adminList) return;
    
    container.innerHTML = ""; adminList.innerHTML = "";

    produtos.forEach((p, index) => {
        container.innerHTML += `
            <div class="product">
                <img src="${p.img}" class="product-image">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <div class="price">R$ ${p.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" onclick="triggerSizeModal(${index})">Adicionar ao Carrinho</button>
                </div>
            </div>`;

        adminList.innerHTML += `
            <div class="admin-item">
                <span>${p.name}</span>
                <button onclick="removeProduct(${index})" style="background:red; color:white; border:none; border-radius:5px; padding:2px 8px; cursor:pointer;">X</button>
            </div>`;
    });
}

// SELEÇÃO DE TAMANHO
function triggerSizeModal(index) {
    if (!logged) return alert("Por favor, faça login primeiro!");
    selectedProduct = produtos[index];
    document.getElementById("modal-product-name").innerText = selectedProduct.name;
    document.getElementById("sizeModal").classList.add("active");
    selectedSizeLabel = "";
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
}

function selectSize(btn) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSizeLabel = btn.innerText;
}

function confirmAdd() {
    if(!selectedSizeLabel) return alert("Selecione um tamanho!");
    addToCart(selectedProduct.name, selectedProduct.price, selectedSizeLabel);
    closeSizeModal();
}

function closeSizeModal() { document.getElementById("sizeModal").classList.remove("active"); }

// CARRINHO
function addToCart(name, price, size) {
    cart.push({ name, price, size });
    updateCartUI();
}

function updateCartUI() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartList.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Tam: ${item.size}</small>
                </div>
                <div>
                    R$ ${item.price.toFixed(2)} 
                    <span class="remove-item" onclick="removeFromCart(${index})"> [X]</span>
                </div>
            </div>`;
    });

    document.getElementById("total").innerText = total.toFixed(2);
    document.getElementById("cart-count").innerText = cart.length;
    document.getElementById("total-profit").innerText = "R$ " + total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// --- ADMIN ---
function addNewProduct() {
    let name = document.getElementById("newProdName").value;
    let price = parseFloat(document.getElementById("newProdPrice").value);
    let img = document.getElementById("newProdImg").value || "img/produtos.png";
    if (name && price) {
        produtos.push({ id: Date.now(), name, price, img });
        renderProducts();
    }
}

function removeProduct(index) { produtos.splice(index, 1); renderProducts(); }

function renderStaff() {
    const list = document.getElementById("staff-list");
    if(!list) return;
    list.innerHTML = "";
    equipe.forEach((m, index) => {
        list.innerHTML += `
            <div class="admin-item">
                <span>${m.name} (${m.role})</span>
                <button onclick="removeStaff(${index})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Remover</button>
            </div>`;
    });
}

function addStaff() {
    let name = document.getElementById("workerName").value;
    let role = document.getElementById("workerRole").value;
    if (name && role) { equipe.push({ name, role }); renderStaff(); }
}
function removeStaff(index) { equipe.splice(index, 1); renderStaff(); }

function applyGlobalPromo() {
    let pct = document.getElementById("promoPercent").value / 100;
    if(pct > 0) {
        produtos.forEach(p => p.price = p.price * (1 - pct));
        renderProducts();
        alert("Desconto aplicado!");
    }
}

// GRAFICO
function initChart() {
    const ctx = document.getElementById('salesChart');
    if(!ctx) return;
    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: { 
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'], 
            datasets: [{ label: 'Vendas', data: [12, 19, 3, 5, 2], borderColor: '#2f6fff', tension: 0.4 }] 
        },
        options: { plugins: { legend: { display: false } } }
    });
}
