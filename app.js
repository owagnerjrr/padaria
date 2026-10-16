const catalog = {
  "Doces": [
    "Alfajor","Arroz doce","Banofe","Gelado","Bombocado Noel","Brigadeirão","Brownie","Carolina tradicional","Carolina mousse limão","Cookie","Cupcake","Curau de milho verde","Donuts","Gelatina colorida","Lua de mel","Manjar","Maria mole","Mousse de abacaxi","Mousse de limão","Mousse de maracujá","Mousse de morango","Mousse de uva","Palha italiana","Palha italiana de ninho","Pão de mel","Pavê de chocolate","Pudim de leite condensado","Pudim de padaria","Queijadinha","Rabanada / doce de leite","Rocambole","Rocambole de brigadeiro","Suspiro","Bombinha recheada","Bombom de uva no pote","Tortas especiais","Bolo cenoura de chocolate","Pudim 150 ml","Pudim 500 ml","Bolo de pote"
  ],
  "Salgados": [
    "Baguete c/ ricota e calabresa","Baguete de frango c/ catupiry","Bauru de presunto e queijo","Bauru de frango","Brioche de salsicha","Cachorro mineiro","Calzone","Croissant de frango","Croissant de presunto e queijo","Croissant peito peru","Empada de bacon com cheddar","Empada de frango","Empada com creme de milho","Empada de palmito","Esfirra aberta de carne","Esfirra aberta de frango","Esfirra aberta de queijo","Esfirra aberta de queijo com brócolis","Esfirra de carne","Esfirra de frango","Estrelito de frango","Estrelito de presunto e queijo","Filão","Focaccia","Pão c/ hambúrguer","Pão de cenoura c/ presunto e queijo","Pão pizza","Pãozinho de frango","Pãozinho recheado","Pastel assado","Pastel assado com creme de milho","Torta de atum","Torta de bacalhau","Torta de frango","Torta de frango especial","Torta de pão de forma cremosa","Torta de ricota","Torta de ricota com brócolis","Torta de sardinha","Torta fria de pão de forma","Trouxinha","Salgado empadinha baça"
  ],
  "Sabores": [
    "Abacaxi","Baunilha","Capuccino cremoso","Cenoura","Chocolate","Churros","Coco","Festa","Formigueiro","Laranja","Leite condensado","Limão","Limão cremoso - piscininha","Mandioca","Mesclado","Milho","Especial"
  ],
  "Caseiros": [
    "Abacaxi com caramelo","Banana caseiro","Banana com canela","Banana com caramelo","Broa de fubá mineira","Broa decorado","Caçarola italiana","Caçarola mineira","Cenoura cob chocolate","Chocolate cobertura brigadeiro","Chocolate recheado","Farinha de milho","Fubá cremoso","Fubá cremoso inglês","Iogurte","Laranja caseiro","Maçã com canela kg","Prestígio un"
  ],
  "Hortifrúti": [
    "A grega - vagem cenoura","Abóbora madura picada vácuo un","Abóbora picada un","Alho descascado","Batata salsa descascada un","Cenoura picada un","Cenoura ralada","Cheiro verde picado","Chuchu picado un","Coco em lasca un","Couve picada","Espaguete de abobrinha un","Espaguete de chuchu un","Fruta abacaxi picado kg","Fruta mamão pedaços kg","Fruta mamão picado kg","Fruta manga picado kg","Fruta melancia pedaços kg","Fruta melancia picada kg","Fruta melão pedaços kg","Fruta mista","Fruta morango picado kg","Kit sopa un","Polpa de maracujá un","Repolho roxo / verde","Repolho verde picado","Salada de berinjela","Salada de frutas Noel un","Salada gourmet frango un","Salada gourmet ovo un","Salada gourmet un","Salada tabule","Salpicão Noel un","Seleta de legumes a vácuo un","Suco de abacaxi com hortelã 300 ml","Suco de abacaxi com hortelã 500 ml","Suco de manga 300 ml","Suco de manga 500 ml","Suco de melancia 300 ml","Suco de melancia 500 ml","Vinagrete un"
  ],
  "Açougue": [
    "Almôndegas","Asa de frango recheada","Bife a rolê","Bife de filé de frango","Bolinho de linguiça com catupiry","Bolinho de linguiça com cheddar","Carne de strogonoff de frango","Costela temperada","Coxa de frango recheada","Coxa sobre coxa recheada","Coxinha asa temperada","Carne bovina bife","Carne bovina em pedaço","Carne suína bife","Carne suína em pedaço","Espetinho bovino","Espetinho de pernil","Filé de frango à milanesa","Frango à passarinho","Frango desossado recheado","Hambúrguer caseiro Noel","Hambúrguer gourmet","Kafta bovina","Kafta de frango","Kibe recheado","Lagarto recheado","Linguiça apimentada","Linguiça de frango Noel","Linguiça de jiló","Linguiça de pernil com bacon","Linguiça de pernil com queijo","Linguiça mista","Salpicão pernil","Lombo recheado suíno","Massa kibe","Medalhão bovino","Medalhão frango","Meio da asa temperada","Pão de alho","Pão de alho com bacon","Pasta de alho","Pasta de alho com bacon","Picadão suíno","Rocambole bovino","Rocambole de frango","Rocambole linguiça toscana","Sobrecoxa de frango","Tempero caseiro","Farofa Noel"
  ],
  "Pizzas": [
    "Massa de mini pizza 20 unidades","Massa mini pizza Noel c/12 unidades","Massa de pizza brotinho c/10","Massa de pizza 1un (brotinho/pão sírio)","Massa de pizza - disco 30 cm","Brotinho","Calabresa","Frango com catupiry","Lombinho","Marguerita","Mista","Moda","Portuguesa","Provolone","Quatro queijos","Calabresa - forneável","Frango com catupiry - forneável","Mista - forneável","Moda - forneável"
  ]
};

const state = {
  store: localStorage.getItem("noel-store") || "02",
  category: "Todos",
  search: "",
  onlySelected: false,
  selected: JSON.parse(localStorage.getItem("noel-current") || "{}")
};

const els = {
  todayLabel: document.getElementById("todayLabel"),
  storeSelect: document.getElementById("storeSelect"),
  searchInput: document.getElementById("searchInput"),
  clearButton: document.getElementById("clearButton"),
  categoryFilters: document.getElementById("categoryFilters"),
  productList: document.getElementById("productList"),
  summaryList: document.getElementById("summaryList"),
  summaryEmpty: document.getElementById("summaryEmpty"),
  reportPreview: document.getElementById("reportPreview"),
  selectedCount: document.getElementById("selectedCount"),
  unitsCount: document.getElementById("unitsCount"),
  categoryCount: document.getElementById("categoryCount"),
  saveButton: document.getElementById("saveButton"),
  copyButton: document.getElementById("copyButton"),
  whatsappButton: document.getElementById("whatsappButton"),
  savedMessage: document.getElementById("savedMessage"),
  historyList: document.getElementById("historyList"),
  onlySelected: document.getElementById("onlySelected")
};

// Migrate the existing draft to the current store without losing selections.
if (!localStorage.getItem(`noel-current-${state.store}`) && localStorage.getItem("noel-current")) {
  localStorage.setItem(`noel-current-${state.store}`, localStorage.getItem("noel-current"));
}
state.selected = JSON.parse(localStorage.getItem(`noel-current-${state.store}`) || "{}");
const today = new Date();
els.todayLabel.textContent = today.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
els.storeSelect.value = state.store;

function keyFor(category, name) {
  return `${category}|||${name}`;
}

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderFilters() {
  const categories = ["Todos", ...Object.keys(catalog)];
  els.categoryFilters.innerHTML = categories.map(cat => `<button class="chip ${state.category === cat ? "active" : ""}" data-category="${cat}">${cat}</button>`).join("");
  els.categoryFilters.querySelectorAll(".chip").forEach(btn => btn.addEventListener("click", () => {
    state.category = btn.dataset.category;
    renderFilters();
    renderProducts();
  }));
}

function renderProducts() {
  const query = normalize(state.search.trim());
  const categories = state.category === "Todos" ? Object.keys(catalog) : [state.category];
  let html = "";

  categories.forEach(category => {
    const matches = catalog[category].filter(name => (!query || normalize(name).includes(query)) && (!state.onlySelected || !!state.selected[keyFor(category,name)]));
    if (!matches.length) return;
    html += `<div class="category-title">${category}</div>`;
    html += matches.map(name => {
      const key = keyFor(category, name);
      const item = state.selected[key];
      const checked = Boolean(item);
      const qty = item?.qty ?? "";
      const unit = /(?:\bkg\b|\bquilo\b)/i.test(name) ? "kg" : "un.";
      const safeQty = String(qty).replace(/[^0-9.,]/g,"");
      return `<label class="product-row ${checked ? "selected" : ""}">
        <input type="checkbox" data-key="${encodeURIComponent(key)}" ${checked ? "checked" : ""} />
        <span class="product-name">${name}</span>
        <span class="qty-wrap">
          <input class="qty-input" data-qty-key="${encodeURIComponent(key)}" type="number" min="0" step="any" inputmode="decimal" placeholder="Qtd." value="${safeQty}" ${checked ? "" : "disabled"} />
          <span class="qty-label">${unit}</span>
        </span>
      </label>`;
    }).join("");
  });

  els.productList.innerHTML = html || `<div class="empty-state">Nenhum produto encontrado.</div>`;

  els.productList.querySelectorAll('input[type="checkbox"]').forEach(box => box.addEventListener("change", event => {
    const key = decodeURIComponent(event.target.dataset.key);
    const [category, name] = key.split("|||");
    if (event.target.checked) {
      state.selected[key] = { category, name, qty: "" };
    } else {
      delete state.selected[key];
    }
    persistCurrent();
    renderProducts();
    renderSummary();
  }));

  els.productList.querySelectorAll(".qty-input").forEach(input => input.addEventListener("input", event => {
    const key = decodeURIComponent(event.target.dataset.qtyKey);
    if (state.selected[key]) {
      state.selected[key].qty = event.target.value;
      persistCurrent();
      renderSummary();
    }
  }));
}

function itemUnit(item) { return /(?:\bkg\b|\bquilo\b)/i.test(item.name) ? "kg" : "un."; }
function quantity(item) { return Number(String(item.qty || "").replace(",", ".")) || 0; }
function selectedItems() {
  return Object.values(state.selected).sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

function buildReport() {
  const items = selectedItems();
  const date = new Date().toLocaleDateString("pt-BR");
  const lines = [`*PRODUÇÃO NOEL — LOJA ${state.store}*`, `Data: ${date}`, ""];
  if (!items.length) return lines.concat("Nenhum produto selecionado.").join("\n");

  let currentCategory = null;
  items.forEach(item => {
    if (item.category !== currentCategory) {
      currentCategory = item.category;
      lines.push(`*${currentCategory.toUpperCase()}*`);
    }
    const qty = String(item.qty).trim();
    lines.push(`• ${item.name}${qty ? ` — ${qty} un.` : ""}`);
  });

  const totalUnits = items.filter(item => itemUnit(item) === "un.").reduce((sum, item) => sum + quantity(item), 0);
  const totalKg = items.filter(item => itemUnit(item) === "kg").reduce((sum, item) => sum + quantity(item), 0);
  lines.push("", `Total de produtos: ${items.length}`);
  if (totalUnits > 0) lines.push(`Total de unidades informadas: ${totalUnits}`);
  if (totalKg > 0) lines.push(`Total em kg informado: ${totalKg}`);
  return lines.join("\n");
}

function renderSummary() {
  const items = selectedItems();
  els.summaryEmpty.style.display = items.length ? "none" : "block";
  els.summaryList.innerHTML = items.map(item => `<div class="summary-item"><strong>${item.name}</strong><span>${item.category}${item.qty ? ` · ${item.qty} un.` : ""}</span></div>`).join("");
  els.reportPreview.value = buildReport();
  els.selectedCount.textContent = items.length;
  els.unitsCount.textContent = items.filter(item => itemUnit(item) === "un.").reduce((sum, item) => sum + quantity(item), 0);
  els.categoryCount.textContent = new Set(items.map(item => item.category)).size;
}

function persistCurrent() {
  localStorage.setItem(`noel-current-${state.store}`, JSON.stringify(state.selected));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("noel-history") || "[]");
  els.historyList.innerHTML = history.length ? history.slice(0, 9).map(entry => `
    <article class="history-card">
      <strong>Loja ${entry.store} · ${entry.date}</strong>
      <span>${entry.count} produtos</span>
      <span>${entry.units} unidades informadas</span>
    </article>`).join("") : `<div class="empty-state">Nenhuma conferência salva ainda.</div>`;
}

els.onlySelected.addEventListener("change", e => { state.onlySelected = e.target.checked; renderProducts(); });
els.searchInput.addEventListener("input", e => { state.search = e.target.value; renderProducts(); });
els.storeSelect.addEventListener("change", e => {
  state.store = e.target.value;
  localStorage.setItem("noel-store", state.store);
  state.selected = JSON.parse(localStorage.getItem(`noel-current-${state.store}`) || "{}");
  renderProducts();
  renderSummary();
});
els.clearButton.addEventListener("click", () => {
  if (!selectedItems().length || confirm("Deseja limpar todos os produtos marcados?")) {
    state.selected = {};
    persistCurrent();
    renderProducts();
    renderSummary();
  }
});

els.saveButton.addEventListener("click", () => {
  const items = selectedItems();
  if (!items.length) {
    els.savedMessage.textContent = "Marque pelo menos um produto antes de salvar.";
    return;
  }
  const history = JSON.parse(localStorage.getItem("noel-history") || "[]");
  history.unshift({
    store: state.store,
    date: new Date().toLocaleString("pt-BR"),
    count: items.length,
    units: items.reduce((sum,item) => sum + (Number(item.qty) || 0), 0),
    items
  });
  localStorage.setItem("noel-history", JSON.stringify(history.slice(0, 50)));
  els.savedMessage.textContent = "Conferência salva neste aparelho.";
  renderHistory();
});

els.copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(buildReport());
    els.savedMessage.textContent = "Relatório copiado. Agora é só colar no WhatsApp.";
  } catch {
    els.reportPreview.select();
    document.execCommand("copy");
    els.savedMessage.textContent = "Relatório copiado.";
  }
});

els.whatsappButton.addEventListener("click", () => {
  const report = encodeURIComponent(buildReport());
  window.open(`https://wa.me/?text=${report}`, "_blank", "noopener,noreferrer");
});

renderFilters();
renderProducts();
renderSummary();
renderHistory();
