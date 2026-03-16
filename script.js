const WHATSAPP_NUMBER_E164 = ""; // Ex.: "5511999999999" (somente números)

const CATEGORIES = [
  { id: "all", label: "Tudo" },
  { id: "doces", label: "Doces" },
  { id: "cafe", label: "Cafés" },
  { id: "gelado", label: "Gelados" },
  { id: "salgados", label: "Salgados" },
  { id: "cha", label: "Chás" },
];

const PRODUCTS = [
  {
    id: "espresso-duplo",
    name: "Espresso Duplo",
    desc: "Extraído curto, intenso e bem balanceado.",
    price: 8.9,
    category: "cafe",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Espresso_coffee.jpg/500px-Espresso_coffee.jpg",
  },
  {
    id: "capuccino-classico",
    name: "Capuccino Clássico",
    desc: "Espresso, leite vaporizado e canela.",
    price: 14.9,
    category: "cafe",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cappuccino_in_cafe_shop.jpg/960px-Cappuccino_in_cafe_shop.jpg",
  },
  {
    id: "latte-avelas",
    name: "Latte de Avelãs",
    desc: "Avelãs suaves, café e leite cremoso.",
    price: 15.9,
    category: "cafe",
    img: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Latte_coffee.jpg",
  },
  {
    id: "mocha-casa",
    name: "Mocha da Casa",
    desc: "Chocolate amargo, espresso duplo e canela.",
    price: 16.9,
    category: "cafe",
    featured: true,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cappuccino_in_cafe_shop.jpg/960px-Cappuccino_in_cafe_shop.jpg",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    desc: "Infusão a frio. Doce, limpo e refrescante.",
    price: 13.9,
    category: "gelado",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Cold_brew_coffee.jpg/1280px-Cold_brew_coffee.jpg",
  },
  {
    id: "cafe-tonica",
    name: "Café Tônica",
    desc: "Cítrico e borbulhante. Perfeito no calor.",
    price: 17.9,
    category: "gelado",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Iced_tea.jpg/1280px-Iced_tea.jpg",
  },
  {
    id: "torta-limao",
    name: "Torta de Limão",
    desc: "Cremosa, cítrica e com base amanteigada.",
    price: 14.9,
    category: "doces",
    featured: true,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Lemon_tart.jpg/1280px-Lemon_tart.jpg",
  },
  {
    id: "cheesecake-baunilha",
    name: "Cheesecake de Baunilha",
    desc: "Textura aveludada e calda do dia.",
    price: 16.9,
    category: "doces",
    featured: true,
    img: "https://upload.wikimedia.org/wikipedia/commons/4/44/Cheesecake.jpg",
  },
  {
    id: "brownie-cacau",
    name: "Brownie de Cacau",
    desc: "Crocante por fora, macio por dentro.",
    price: 11.9,
    category: "doces",
    featured: true,
    img: "https://upload.wikimedia.org/wikipedia/commons/3/36/Chocolate_Brownie.jpg",
  },
  {
    id: "cookies-casa",
    name: "Cookies da Casa",
    desc: "Chocolate meio amargo e sal marinho.",
    price: 9.9,
    category: "doces",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Chocolate_chip_cookie.jpg/1280px-Chocolate_chip_cookie.jpg",
  },
  {
    id: "pao-queijo",
    name: "Pão de Queijo",
    desc: "Quentinho e com queijo de verdade.",
    price: 7.9,
    category: "salgados",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/P%C3%A3o_de_Queijo.jpg/1280px-P%C3%A3o_de_Queijo.jpg",
  },
  {
    id: "misto-na-chapa",
    name: "Misto na Chapa",
    desc: "Pão dourado, queijo derretendo.",
    price: 12.9,
    category: "salgados",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/af/Grilled_cheese_sandwiches.jpg",
  },
  {
    id: "cha-mate-limao",
    name: "Chá Mate com Limão",
    desc: "Gelado, leve e aromático.",
    price: 10.9,
    category: "cha",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Iced_tea.jpg/1280px-Iced_tea.jpg",
  },
];

const STORAGE_KEY = "cafeteria-aurora-cart-v1";

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function byId(id) {
  return document.getElementById(id);
}

function toast(message) {
  const el = byId("toast");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => {
    el.hidden = true;
  }, 1800);
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

let cart = loadCart();
let activeCategory = "all";
let query = "";

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartSubtotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = getProduct(id);
    if (!product) return sum;
    return sum + product.price * qty;
  }, 0);
}

function setCartQty(id, qty) {
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
  renderCart();
  renderCartBadge();
}

function addToCart(id, qty = 1) {
  const product = getProduct(id);
  if (!product) return;
  const next = (cart[id] || 0) + qty;
  setCartQty(id, next);
  toast(`${product.name} adicionado`);
}

function clearCart() {
  cart = {};
  saveCart(cart);
  renderCart();
  renderCartBadge();
  toast("Carrinho limpo");
}

function renderCartBadge() {
  const count = cartCount();
  const badge = document.querySelector(".cartCount");
  if (badge) badge.textContent = String(count);
  const sub = byId("cartSub");
  if (sub) sub.textContent = `${count} ${count === 1 ? "item" : "itens"}`;
  renderCheckoutBar();
}

function renderCheckoutBar() {
  const bar = byId("checkoutBar");
  const totalEl = byId("checkoutTotal");
  if (!bar || !totalEl) return;

  const count = cartCount();
  bar.hidden = count === 0;
  totalEl.textContent = formatBRL(cartSubtotal());
}

function openCart() {
  document.body.classList.add("cartOpen");
  const drawer = byId("cartDrawer");
  const scrim = document.querySelector(".scrim");
  const fab = document.querySelector(".cartFab");
  if (drawer) drawer.setAttribute("aria-hidden", "false");
  if (scrim) scrim.hidden = false;
  if (fab) fab.setAttribute("aria-expanded", "true");
}

function closeCart() {
  document.body.classList.remove("cartOpen");
  const drawer = byId("cartDrawer");
  const scrim = document.querySelector(".scrim");
  const fab = document.querySelector(".cartFab");
  if (drawer) drawer.setAttribute("aria-hidden", "true");
  if (scrim) scrim.hidden = true;
  if (fab) fab.setAttribute("aria-expanded", "false");
}

function renderCart() {
  const container = byId("cartItems");
  if (!container) return;

  const items = Object.entries(cart)
    .map(([id, qty]) => ({ product: getProduct(id), qty }))
    .filter((x) => x.product);

  if (items.length === 0) {
    container.innerHTML = `<p class="muted">Seu carrinho está vazio. Escolha algo no cardápio.</p>`;
  } else {
    container.innerHTML = items
      .map(({ product, qty }) => {
        const line = formatBRL(product.price * qty);
        return `
          <div class="cartItem">
            <div class="cartTopRow">
              <div class="cartLeft">
                <div class="cartThumb" aria-hidden="true">
                  <img src="${product.img}" alt="" loading="lazy" />
                </div>
                <div class="cartText">
                  <div class="cartTitle">${product.name}</div>
                  <p class="cartDesc">${product.desc}</p>
                </div>
              </div>
              <div class="mono">${line}</div>
            </div>
            <div class="qtyRow">
              <div class="qtyControls" role="group" aria-label="Quantidade ${product.name}">
                <button class="qtyBtn" type="button" data-dec="${product.id}" aria-label="Diminuir">-</button>
                <div class="qtyVal" aria-label="Quantidade">${qty}</div>
                <button class="qtyBtn" type="button" data-inc="${product.id}" aria-label="Aumentar">+</button>
              </div>
              <button class="iconBtn" type="button" data-remove="${product.id}">Remover</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  const subtotal = cartSubtotal();
  const subtotalEl = byId("cartSubtotal");
  const totalEl = byId("cartTotal");
  if (subtotalEl) subtotalEl.textContent = formatBRL(subtotal);
  if (totalEl) totalEl.textContent = formatBRL(subtotal);
}

function filteredProducts() {
  const q = query.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const byCat = activeCategory === "all" ? true : p.category === activeCategory;
    if (!byCat) return false;
    if (!q) return true;
    const hay = `${p.name} ${p.desc}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderFilters() {
  const host = document.querySelector(".filters");
  if (!host) return;

  host.innerHTML = CATEGORIES.map((c) => {
    const pressed = c.id === activeCategory ? "true" : "false";
    return `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${pressed}">${c.label}</button>`;
  }).join("");
}

function renderFeaturedDesserts() {
  const host = byId("featuredStrip");
  if (!host) return;

  const desserts = PRODUCTS.filter((p) => p.category === "doces").filter(
    (p) => p.featured
  );

  host.innerHTML = desserts
    .map((p) => {
      return `
        <article class="featuredCard" aria-label="${p.name}">
          <div class="featuredImg" aria-hidden="true">
            <img src="${p.img}" alt="" loading="lazy" />
          </div>
          <span class="ribbon">Destaque</span>
          <div class="featuredBody">
            <div class="featuredTitleRow">
              <h4 class="featuredTitle">${p.name}</h4>
              <span class="featuredPrice mono">${formatBRL(p.price)}</span>
            </div>
            <p class="itemDesc">${p.desc}</p>
            <div class="itemFooter">
              <button class="addBtn" type="button" data-add="${p.id}">Adicionar</button>
              <span class="pill">Doces</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderMenu() {
  const grid = byId("menuGrid");
  const empty = document.querySelector(".menuEmpty");
  if (!grid || !empty) return;

  const items = filteredProducts();
  empty.hidden = items.length !== 0;

  grid.innerHTML = items
    .map((p) => {
      const catLabel = CATEGORIES.find((c) => c.id === p.category)?.label || "";
      return `
        <article class="itemCard" aria-label="${p.name}">
          <div class="itemMedia" aria-hidden="true">
            <img src="${p.img}" alt="" loading="lazy" />
          </div>
          <div class="itemBody">
            <div class="itemTitleRow">
              <h3 class="itemTitle">${p.name}</h3>
              <span class="itemPrice mono">${formatBRL(p.price)}</span>
            </div>
            <p class="itemDesc">${p.desc}</p>
            <div class="itemFooter">
              <button class="addBtn" type="button" data-add="${p.id}">Adicionar</button>
              <span class="muted tiny">${catLabel}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setCategory(id) {
  activeCategory = id;
  renderFilters();
  renderMenu();
}

function buildWhatsAppMessage() {
  const items = Object.entries(cart)
    .map(([id, qty]) => ({ product: getProduct(id), qty }))
    .filter((x) => x.product);

  if (items.length === 0) return "";

  const lines = items.map(({ product, qty }) => {
    return `- ${qty}x ${product.name} (${formatBRL(product.price * qty)})`;
  });

  const total = formatBRL(cartSubtotal());

  return [
    "Olá! Gostaria de fazer um pedido na Cafeteria Aurora:",
    "",
    ...lines,
    "",
    `Total: ${total}`,
  ].join("\n");
}

function checkout() {
  const message = buildWhatsAppMessage();
  if (!message) {
    toast("Seu carrinho está vazio");
    return;
  }

  if (!WHATSAPP_NUMBER_E164) {
    void navigator.clipboard?.writeText(message);
    toast("Pedido copiado");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setupEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const add = target.getAttribute("data-add");
    if (add) {
      addToCart(add, 1);
      return;
    }

    const inc = target.getAttribute("data-inc");
    if (inc) {
      setCartQty(inc, (cart[inc] || 0) + 1);
      return;
    }

    const dec = target.getAttribute("data-dec");
    if (dec) {
      setCartQty(dec, (cart[dec] || 0) - 1);
      return;
    }

    const remove = target.getAttribute("data-remove");
    if (remove) {
      setCartQty(remove, 0);
      toast("Item removido");
      return;
    }

    if (target.matches("[data-open-cart]") || target.closest("[data-open-cart]")) {
      openCart();
      return;
    }

    if (target.matches("[data-close-cart]") || target.closest("[data-close-cart]")) {
      closeCart();
      return;
    }

    const cat = target.getAttribute("data-cat");
    if (cat) {
      setCategory(cat);
    }
  });

  const fab = document.querySelector(".cartFab");
  if (fab) fab.addEventListener("click", openCart);

  const scrim = document.querySelector(".scrim");
  if (scrim) scrim.addEventListener("click", closeCart);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });

  const search = byId("search");
  if (search) {
    search.addEventListener("input", () => {
      query = search.value || "";
      renderMenu();
    });
    search.addEventListener("search", () => {
      query = search.value || "";
      renderMenu();
    });
  }

  const clear = byId("clearCart");
  if (clear) clear.addEventListener("click", clearCart);

  const checkoutBtn = byId("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);

  const newsForm = byId("newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      toast("Inscrição recebida. Obrigado!");
      newsForm.reset();
    });
  }
}

function initWhatsLabel() {
  const label = byId("whatsLabel");
  if (!label) return;
  label.textContent = WHATSAPP_NUMBER_E164 ? `+${WHATSAPP_NUMBER_E164}` : "(defina no script.js)";
}

renderFilters();
renderFeaturedDesserts();
renderMenu();
renderCart();
renderCartBadge();
setupEvents();
initWhatsLabel();
