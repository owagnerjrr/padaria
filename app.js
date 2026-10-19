// Preservar o armazenamento original antes de qualquer adaptação legada.
if (!localStorage.getItem('noel-original-backup-v1')) {
  const raw={};
  for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key.startsWith('noel-'))raw[key]=localStorage.getItem(key);}
  localStorage.setItem('noel-original-backup-v1',JSON.stringify({createdAt:new Date().toISOString(),localStorage:raw}));
}
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

// Personalizações locais do catálogo, preservando a lista original.
const baseCatalog = JSON.parse(JSON.stringify(catalog));
function readCatalogEdits() {
  try { const edits=JSON.parse(localStorage.getItem("noel-catalog-edits") || '{"added":[],"removed":[]}');return {...edits,categories:edits.categories||[]}; }
  catch { return {added:[],removed:[],categories:[]}; }
}
const catalogEdits = readCatalogEdits();
const productCodes = JSON.parse(localStorage.getItem("noel-product-codes") || "{}");
function saveProductCodes(){localStorage.setItem("noel-product-codes",JSON.stringify(productCodes));window.noelSync?.onChange?.();}
function applyCatalogEdits() {
  for(const category of Object.keys(catalog))if(!baseCatalog[category])delete catalog[category];
  for(const category of catalogEdits.categories||[])if(!catalog[category])catalog[category]=[];
  Object.keys(baseCatalog).forEach(category => {
    catalog[category] = baseCatalog[category].filter(name => !catalogEdits.removed.some(item => item.category === category && item.name === name));
  });
  catalogEdits.added.forEach(item => {
    if (catalog[item.category] && !catalog[item.category].some(name => normalize(name) === normalize(item.name))) catalog[item.category].push(item.name);
  });
}
function saveCatalogEdits() { localStorage.setItem("noel-catalog-edits",JSON.stringify(catalogEdits));applyCatalogEdits();window.noelSync?.onChange?.(); }
applyCatalogEdits();

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
  clearQuantitiesButton: document.getElementById("clearQuantitiesButton"),
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
  shareOptions: document.getElementById("shareOptions"),
  whatsappTextButton: document.getElementById("whatsappTextButton"),
  whatsappExcelButton: document.getElementById("whatsappExcelButton"),
  savedMessage: document.getElementById("savedMessage"),
  historyList: document.getElementById("historyList"),
  onlySelected: document.getElementById("onlySelected"),
  excelFile: document.getElementById("excelFile"),
  importStatus: document.getElementById("importStatus"),
  importPreview: document.getElementById("importPreview"),
  importResults: document.getElementById("importResults"),
  replaceImport: document.getElementById("replaceImport"),
  confirmImport: document.getElementById("confirmImport"),
  cancelImport: document.getElementById("cancelImport")
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
function escapeHTML(value) { return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const defaultCategoryIcons = {"Todos":"▦","Doces":"🧁","Salgados":"🥟","Sabores":"🍮","Caseiros":"🥖","Hortifrúti":"🌿","Açougue":"🥩","Pizzas":"🍕"};
const iconChoices = ["🧁","🍰","🍩","🍪","🍫","🍬","🍮","🍦","🥟","🥐","🥖","🥨","🍞","🥪","🍔","🌭","🍕","🍟","🥗","🥬","🥕","🍎","🍓","🍇","🍌","🍍","🥩","🍗","🍖","🧀","🥛","☕","🧃","🎂","🍽️","📦","⭐","🏷️"];
function iconForCategory(category){ return catalogEdits.icons?.[category] || defaultCategoryIcons[category] || "🏷️"; }
const iconCategorySelect=document.getElementById("groupIconCategory");
const iconChoiceSelect=document.getElementById("groupIconChoice");
function setupGroupIcons(){
  iconCategorySelect.innerHTML=Object.keys(catalog).map(category=>`<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  iconChoiceSelect.innerHTML=[...new Set([...Object.values(defaultCategoryIcons),...iconChoices])].map(icon=>`<option value="${icon}">${icon}</option>`).join("");
  const update=()=>{const current=iconForCategory(iconCategorySelect.value);if(![...iconChoiceSelect.options].some(option=>option.value===current)){iconChoiceSelect.add(new Option(current,current));}iconChoiceSelect.value=current;};
  iconCategorySelect.addEventListener("change",update);
  document.getElementById("saveGroupIcon").addEventListener("click",()=>{
    catalogEdits.icons ||= {};
    catalogEdits.icons[iconCategorySelect.value]=iconChoiceSelect.value;
    saveCatalogEdits();refreshCatalog();
    manage.message.textContent="Ícone de "+iconCategorySelect.value+" atualizado para "+iconChoiceSelect.value+".";
  });
  update();
}

const manage = {
  form:document.getElementById("addProductForm"),
  name:document.getElementById("newProductName"),
  category:document.getElementById("newProductCategory"),
  search:document.getElementById("manageSearch"),
  results:document.getElementById("manageResults"),
  message:document.getElementById("manageMessage")
};
function suggestCategory(name) {
  const n=normalize(name);
  if (/pizza|brotinho|calabresa forneavel|provolone/.test(n)) return "Pizzas";
  if (/carne|frango|bife|linguica|costela|kafta|hamburguer|medalhao|pernil|almondega|espetinho/.test(n)) return "Açougue";
  if (/fruta|salada|legume|verdura|couve|cenoura picad|cenoura ralad|abobora|suco|repolho|hortela|chuchu|abobrinha|vinagrete/.test(n)) return "Hortifrúti";
  if (/croissant|esfirra|empada|pastel|salgado|bauru|focaccia|baguete|coxinha|pao de queijo|torta de frango/.test(n)) return "Salgados";
  if (/caseiro|broa|fuba|cacarola/.test(n)) return "Caseiros";
  if (/sabor|recheio|cobertura/.test(n)) return "Sabores";
  return "Doces";
}
manage.name.addEventListener("input",()=>{manage.category.value=suggestCategory(manage.name.value);});
setupGroupIcons();
function refreshCategoryOptions(){
  const previous=manage.category.value;
  manage.category.innerHTML=Object.keys(catalog).map(category=>`<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  if(catalog[previous])manage.category.value=previous;
  const previousIcon=iconCategorySelect.value;
  iconCategorySelect.innerHTML=Object.keys(catalog).map(category=>`<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  if(catalog[previousIcon])iconCategorySelect.value=previousIcon;
  iconCategorySelect.dispatchEvent(new Event("change"));
}
function refreshCatalog() { refreshCategoryOptions();renderFilters();renderProducts();renderSummary();renderManageResults(); }
refreshCategoryOptions();
document.getElementById("createCategoryButton").addEventListener("click",()=>{
  const field=document.getElementById("newCategoryName");
  const name=field.value.trim().replace(/\s+/g," ");
  if(!name||name.length>50||/[<>|]/.test(name)){manage.message.textContent="Informe uma categoria válida (até 50 caracteres).";return;}
  const existing=Object.keys(catalog).find(category=>normalize(category)===normalize(name));
  if(existing){manage.category.value=existing;manage.message.textContent="Esta categoria já existe.";return;}
  catalogEdits.categories ||= [];catalogEdits.categories.push(name);
  saveCatalogEdits();refreshCatalog();manage.category.value=name;field.value="";
  manage.message.textContent="Categoria "+name+" criada e disponível nas quatro lojas.";
});
manage.form.addEventListener("submit",event=>{
  event.preventDefault();
  const name=manage.name.value.trim().replace(/\s+/g," ");
  const category=manage.category.value;
  if(!name || !catalog[category])return;
  const duplicate=Object.entries(catalog).some(([cat,names])=>names.some(x=>normalize(x)===normalize(name)));
  if(duplicate){manage.message.textContent="Este nome já existe no catálogo. Use outro nome.";return;}
  catalogEdits.removed=catalogEdits.removed.filter(item=>!(item.category===category&&normalize(item.name)===normalize(name)));
  catalogEdits.added.push({category,name});
  saveCatalogEdits();manage.name.value="";manage.message.textContent="Produto adicionado em "+category+".";
  refreshCatalog();
});
function renderManageResults() {
  const query=normalize(manage.search.value.trim());
  if(!query){manage.results.replaceChildren();return;}
  const items=Object.entries(catalog).flatMap(([category,names])=>names.map(name=>({category,name})))
    .filter(item=>normalize(item.name).includes(query)).slice(0,30);
  manage.results.replaceChildren();
  items.forEach(item=>{
    const row=document.createElement("div");row.className="manage-result";
    const label=document.createElement("span");label.textContent=item.name+" · "+item.category;
    const editButton=document.createElement("button");editButton.type="button";editButton.textContent="Editar";editButton.className="secondary-button";
    editButton.addEventListener("click",()=>{
      const name=prompt("Editar nome do produto:",item.name)?.trim().replace(/\s+/g," ");
      if(name===undefined||name===null)return;
      if(!name||name.length>120||/[<>|]/.test(name)){manage.message.textContent="Nome inválido (máximo 120 caracteres, sem < > ou |).";return;}
      const category=prompt("Categoria do produto ("+Object.keys(catalog).join(", ")+"):",item.category)?.trim();
      if(category===undefined||category===null)return;
      if(!catalog[category]){manage.message.textContent="Categoria não encontrada. Escolha uma categoria existente.";return;}
      const oldKey=keyFor(item.category,item.name),newKey=keyFor(category,name);
      if(newKey===oldKey){manage.message.textContent="Nenhuma alteração realizada.";return;}
      if(Object.entries(catalog).some(([cat,names])=>names.some(existing=>keyFor(cat,existing)!==oldKey&&normalize(existing)===normalize(name)))){manage.message.textContent="Já existe outro produto com este nome.";return;}
      if(!confirm('Salvar alteração de "'+item.name+'" para "'+name+'" em '+category+'? As quantidades e marcações das quatro lojas serão preservadas.'))return;
      const stores=["01","02","03","04"];
      for(const store of stores){
        const selected=JSON.parse(localStorage.getItem("noel-current-"+store)||"{}");
        const quantities=JSON.parse(localStorage.getItem("noel-quantities-"+store)||"{}");
        if(Object.prototype.hasOwnProperty.call(selected,oldKey)){
          selected[newKey]={...selected[oldKey],category,name};delete selected[oldKey];
        }
        if(Object.prototype.hasOwnProperty.call(quantities,oldKey)){
          quantities[newKey]=quantities[oldKey];delete quantities[oldKey];
        }
        localStorage.setItem("noel-current-"+store,JSON.stringify(selected));
        localStorage.setItem("noel-quantities-"+store,JSON.stringify(quantities));
        if(store===state.store){state.selected=selected;state.quantities=quantities;}
      }
      if(Object.prototype.hasOwnProperty.call(productCodes,oldKey)){productCodes[newKey]=productCodes[oldKey];delete productCodes[oldKey];}
      catalogEdits.added=catalogEdits.added.filter(x=>keyFor(x.category,x.name)!==oldKey&&keyFor(x.category,x.name)!==newKey);
      catalogEdits.removed=catalogEdits.removed.filter(x=>keyFor(x.category,x.name)!==newKey);
      catalogEdits.removed.push({category:item.category,name:item.name});
      catalogEdits.added.push({category,name});
      localStorage.setItem("noel-product-codes",JSON.stringify(productCodes));
      saveCatalogEdits();
      manage.search.value=name;
      manage.message.textContent="Produto editado. Quantidades, seleções e código preservados nas quatro lojas. Aguarde a sincronização.";
      refreshCatalog();
    });
    const button=document.createElement("button");button.type="button";button.textContent="Excluir";button.className="manage-delete";
    button.addEventListener("click",()=>{
      if(!confirm('Excluir "'+item.name+'" do catálogo? As quantidades e seleções deste produto serão apagadas nas quatro lojas.'))return;
      const key=keyFor(item.category,item.name);
      catalogEdits.added=catalogEdits.added.filter(x=>!(x.category===item.category&&x.name===item.name));
      catalogEdits.removed.push(item);
      for(const store of ["01","02","03","04"]){
        const selected=JSON.parse(localStorage.getItem(`noel-current-${store}`)||"{}");
        const quantities=JSON.parse(localStorage.getItem(`noel-quantities-${store}`)||"{}");
        delete selected[key];delete quantities[key];
        localStorage.setItem(`noel-current-${store}`,JSON.stringify(selected));
        localStorage.setItem(`noel-quantities-${store}`,JSON.stringify(quantities));
      }
      delete state.selected[key];delete state.quantities[key];delete productCodes[key];saveProductCodes();
      saveCatalogEdits();manage.message.textContent="Produto excluído do catálogo.";refreshCatalog();
    });
    row.append(label,editButton,button);manage.results.append(row);
  });
  if(!items.length)manage.results.textContent="Nenhum produto encontrado.";
}
manage.search.addEventListener("input",renderManageResults);

function renderFilters() {
  const categories = ["Todos", ...Object.keys(catalog)];
  els.categoryFilters.innerHTML = categories.map((cat, i) => `<button class="chip ${state.category === cat ? "active" : ""}" data-category="${cat}"><span class="chip-icon" aria-hidden="true">${iconForCategory(cat)}</span> ${cat}</button>`).join("");
  els.categoryFilters.querySelectorAll(".chip").forEach(btn => btn.addEventListener("click", () => {
    state.category = btn.dataset.category;
    renderFilters();
    renderProducts();
  }));
}

function loadQuantities(store) {
  const saved = JSON.parse(localStorage.getItem(`noel-quantities-${store}`) || "{}");
  const selected = JSON.parse(localStorage.getItem(`noel-current-${store}`) || "{}");
  Object.entries(selected).forEach(([key,item]) => {
    if (!(key in saved)) saved[key] = item.qty ?? "";
  });
  return saved;
}
state.quantities = loadQuantities(state.store);

function renderProducts() {
  const query = normalize(state.search.trim());
  const categories = state.category === "Todos" ? Object.keys(catalog) : [state.category];
  let html = "";

  categories.forEach(category => {
    const matches = catalog[category].filter(name => (!query || normalize(name).includes(query)) && (!state.onlySelected || !!state.selected[keyFor(category,name)])).sort((a,b) => a.localeCompare(b,"pt-BR",{sensitivity:"base",numeric:true}));
    if (!matches.length) return;
    html += `<div class="category-title">${iconForCategory(category)} ${escapeHTML(category)}</div>`;
    html += matches.map(name => {
      const key = keyFor(category, name);
      const item = state.selected[key];
      const checked = Boolean(item);
      const qty = state.quantities[key] ?? item?.qty ?? "";
      const unit = /(?:\bkg\b|\bquilo\b)/i.test(name) ? "kg" : "un.";
      const safeQty = String(qty).replace(/[^0-9.,]/g,"");
      return `<div class="product-row ${checked ? "selected" : ""}">
        <input type="checkbox" aria-label="Selecionar ${escapeHTML(name)}" data-key="${encodeURIComponent(key)}" ${checked ? "checked" : ""} />
        <span class="product-name">${escapeHTML(name)}</span>
        <span class="code-wrap"><input class="code-input" aria-label="Código de ${escapeHTML(name)}" data-code-key="${encodeURIComponent(key)}" type="text" inputmode="numeric" maxlength="32" placeholder="Código" value="${escapeHTML(productCodes[key] || "")}" /></span>
        <span class="qty-wrap">
          <input class="qty-input" aria-label="Quantidade de ${escapeHTML(name)}" data-qty-key="${encodeURIComponent(key)}" type="number" min="0" step="any" inputmode="decimal" placeholder="Qtd." value="${safeQty}" />
          <span class="qty-label">${unit}</span>
        </span>
      </div>`;
    }).join("");
  });

  els.productList.innerHTML = html || `<div class="empty-state">Nenhum produto encontrado.</div>`;

  els.productList.querySelectorAll('input[type="checkbox"]').forEach(box => box.addEventListener("change", event => {
    const key = decodeURIComponent(event.target.dataset.key);
    const [category, name] = key.split("|||");
    if (event.target.checked) {
      state.selected[key] = { category, name, qty: state.quantities[key] ?? "" };
    } else {
      delete state.selected[key];
    }
    persistCurrent();
    renderProducts();
    renderSummary();
  }));

  els.productList.querySelectorAll(".code-input").forEach(input => input.addEventListener("change", event => {
    const key=decodeURIComponent(event.target.dataset.codeKey);
    const value=event.target.value.trim();
    if(value)productCodes[key]=value;else delete productCodes[key];
    saveProductCodes();renderSummary();
  }));
  els.productList.querySelectorAll(".qty-input").forEach(input => input.addEventListener("input", event => {
    const key = decodeURIComponent(event.target.dataset.qtyKey);
    state.quantities[key] = event.target.value;
    if (state.selected[key]) state.selected[key].qty = event.target.value;
    persistCurrent();
    renderSummary();
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
    const code=productCodes[keyFor(item.category,item.name)];
    lines.push(`• ${item.name}${code ? ` (Cód. ${code})` : ""}${qty ? ` — ${qty} ${itemUnit(item)}` : ""}`);
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
  els.summaryList.innerHTML = items.map(item => `<div class="summary-item"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.category)}${productCodes[keyFor(item.category,item.name)] ? ` · Cód. ${escapeHTML(productCodes[keyFor(item.category,item.name)])}` : ""}${item.qty ? ` · ${escapeHTML(item.qty)} un.` : ""}</span></div>`).join("");
  els.reportPreview.value = buildReport();
  els.selectedCount.textContent = items.length;
  els.unitsCount.textContent = items.filter(item => itemUnit(item) === "un.").reduce((sum, item) => sum + quantity(item), 0);
  els.categoryCount.textContent = new Set(items.map(item => item.category)).size;
}

function persistCurrent() {
  localStorage.setItem(`noel-quantities-${state.store}`, JSON.stringify(state.quantities));
  localStorage.setItem(`noel-current-${state.store}`, JSON.stringify(state.selected));
  window.noelSync?.onChange?.();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("noel-history") || "[]").filter(entry=>entry.store===state.store);
  els.historyList.innerHTML = history.length ? history.slice(0, 9).map(entry => `
    <article class="history-card">
      <strong>Loja ${escapeHTML(entry.store)} · ${escapeHTML(entry.date)}</strong>
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
  state.quantities = loadQuantities(state.store);
  renderProducts();
  renderSummary();
  renderHistory();
});
els.clearButton.addEventListener("click", () => {
  if (!selectedItems().length || confirm("Deseja limpar todos os produtos marcados?")) {
    state.selected = {};
    persistCurrent();
    renderProducts();
    renderSummary();
  }
});

// Zera somente a loja selecionada. Códigos são compartilhados entre lojas e permanecem intactos.
function clearAllQuantitiesForStore() {
  const store=state.store;
  const keys=new Set([...Object.keys(state.quantities),...Object.keys(state.selected)]);
  const filled=[...keys].filter(key=>String(state.quantities[key] ?? state.selected[key]?.qty ?? "").trim()!=="" && Number(state.quantities[key] ?? state.selected[key]?.qty)!==0);
  if(!filled.length){
    els.savedMessage.textContent="Não há quantidades preenchidas para zerar na Loja "+store+".";
    return;
  }
  if(!confirm("Zerar somente as quantidades da Loja "+store+"? As outras lojas e os códigos dos produtos serão mantidos."))return;
  for(const key of keys)if(String(state.quantities[key] ?? state.selected[key]?.qty ?? "").trim()!=="")state.quantities[key]="0";
  for(const item of Object.values(state.selected))if(String(item.qty??"").trim()!=="")item.qty="0";
  persistCurrent();
  renderProducts();renderSummary();
  els.clearQuantitiesButton.textContent="✓ Loja "+store+" zerada";
  els.savedMessage.textContent="Quantidades da Loja "+store+" zeradas. Outras lojas e códigos preservados. Aguarde a sincronização.";
  setTimeout(()=>els.clearQuantitiesButton.textContent="⌫ Zerar quantidades",3000);
}
els.clearQuantitiesButton.addEventListener("click",clearAllQuantitiesForStore);

els.saveButton.addEventListener("click", () => {
  const items = selectedItems();
  if (!items.length) {
    els.savedMessage.textContent = "Marque pelo menos um produto antes de salvar.";
    return;
  }
  const history = JSON.parse(localStorage.getItem("noel-history") || "[]");
  history.unshift({
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    store: state.store,
    date: new Date().toLocaleString("pt-BR"),
    count: items.length,
    units: items.reduce((sum,item) => sum + (Number(item.qty) || 0), 0),
    items
  });
  localStorage.setItem("noel-history", JSON.stringify(history));
  window.noelSync?.onChange?.();
  els.savedMessage.textContent = "Conferência salva. Consulte o status de sincronização.";
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

function createExcelFile() {
  if (typeof XLSX === "undefined") throw new Error("Biblioteca Excel não carregada. Verifique sua conexão.");
  const items = selectedItems();
  if (!items.length) throw new Error("Marque pelo menos um produto para exportar.");
  const date = new Date();
  const formattedDate = date.toLocaleDateString("pt-BR");
  const rows = [
    ["NOEL SUPERMERCADOS — RELATÓRIO DE PRODUÇÃO"],
    ["Loja", state.store],
    ["Data", formattedDate],
    [],
    ["Categoria", "Produto", "Código", "Quantidade", "Unidade"]
  ];
  items.forEach(item => {
    const raw = String(item.qty ?? "").trim().replace(",", ".");
    rows.push([item.category,item.name,productCodes[keyFor(item.category,item.name)] || "",raw !== "" && Number.isFinite(Number(raw)) ? Number(raw) : "",itemUnit(item)]);
  });
  rows.push([],["Total de produtos",items.length]);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{wch:20},{wch:48},{wch:20},{wch:16},{wch:12}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Conferência");
  const bytes = XLSX.write(wb,{bookType:"xlsx",type:"array"});
  const filename = "Producao_Noel_Loja_"+state.store+"_"+date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0")+".xlsx";
  return new File([bytes],filename,{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
}
function downloadExcel(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;a.download=file.name;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
els.whatsappButton.addEventListener("click",()=>{
  els.shareOptions.hidden=!els.shareOptions.hidden;
  els.whatsappButton.setAttribute("aria-expanded",String(!els.shareOptions.hidden));
});
els.whatsappTextButton.addEventListener("click",()=>{
  const report = encodeURIComponent(buildReport());
  window.open("https://wa.me/?text="+report,"_blank","noopener,noreferrer");
});
els.whatsappExcelButton.addEventListener("click",async()=>{
  try {
    const file=createExcelFile();
    if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
      try {
        await navigator.share({files:[file],title:"Produção Noel — Loja "+state.store});
        els.savedMessage.textContent="Arquivo compartilhado pelo sistema do celular.";
        return;
      } catch(e) {
        if(e.name==="AbortError")return;
      }
    }
    downloadExcel(file);
    els.savedMessage.textContent="Excel baixado. Abra o WhatsApp e anexe o arquivo ao grupo desejado.";
  } catch(e) {
    els.savedMessage.textContent=e.message;
  }
});

renderFilters();
renderProducts();
renderSummary();
renderHistory();

let pendingImport = null;
function parseAmount(value) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(raw)) return null;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}
function parseExcelRows(workbook) {
  const lookup = new Map();
  Object.entries(catalog).forEach(([category,names]) => names.forEach(name => {
    const normalized = normalize(name).replace(/[^a-z0-9]/g,"");
    const found = lookup.get(normalized) || [];
    found.push({category,name,key:keyFor(category,name)});
    lookup.set(normalized,found);
  }));
  const found = new Map(), warnings = [], ambiguous = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet,{header:1,defval:"",raw:true});
    for (let ri=0;ri<rows.length;ri++) {
      const row=rows[ri];
      for (let ci=0;ci<row.length;ci++) {
        if(typeof row[ci]!=="string") continue;
        const token=normalize(row[ci].trim()).replace(/[^a-z0-9]/g,"");
        const candidates=lookup.get(token);
        if(!candidates) continue;
        if(candidates.length!==1){ambiguous.push(sheetName+" linha "+(ri+1)+": "+row[ci]);continue;}
        // Quantity must be in the immediately adjacent column, or under an explicit QTD/QUANTIDADE header.
        let value=parseAmount(row[ci+1]);
        if(value===null) {
          for(let header=ri-1;header>=Math.max(0,ri-5);header--) {
            for(let col=ci+1;col<Math.min(row.length,ci+5);col++){
              if(/^(qtd|quantidade|estoque|disponivel)$/i.test(normalize(String(rows[header]?.[col]||"")).trim())){
                value=parseAmount(row[col]);break;
              }
            }
            if(value!==null)break;
          }
        }
        if(value===null){warnings.push(sheetName+" linha "+(ri+1)+": "+row[ci]);continue;}
        const item=candidates[0];
        if(found.has(item.key)) warnings.push("Produto repetido: "+item.name+" ("+sheetName+", linha "+(ri+1)+")");
        else found.set(item.key,{...item,qty:String(value)});
      }
    }
  }
  return {items:[...found.values()],warnings,ambiguous};
}
function closeImport() {
  pendingImport=null; els.importPreview.hidden=true; els.excelFile.value="";
}
els.excelFile.addEventListener("change",async e=>{
  const file=e.target.files?.[0];
  closeImport();
  if(!file)return;
  els.importStatus.textContent="Lendo planilha...";
  try {
    if(typeof XLSX==="undefined")throw new Error("Biblioteca Excel indisponível. Verifique a conexão.");
    if(file.size>25*1024*1024)throw new Error("Arquivo maior que 25 MB. Exporte somente a aba de conferência.");
    const wb=XLSX.read(await file.arrayBuffer(),{type:"array"});
    const result=parseExcelRows(wb);
    pendingImport={...result,store:state.store};
    els.importResults.replaceChildren();
    const p=document.createElement("p");
    p.textContent=result.items.length+" produtos reconhecidos com quantidade maior que zero. "+result.warnings.length+" linhas sem quantidade válida ou repetidas; "+result.ambiguous.length+" nomes ambíguos.";
    els.importResults.append(p);
    const list=document.createElement("div");list.className="import-list";
    result.items.forEach(item=>{const line=document.createElement("div");line.textContent=item.name+" — "+item.qty+" "+itemUnit(item);list.append(line);});
    els.importResults.append(list);
    if(result.warnings.length||result.ambiguous.length){
      const warn=document.createElement("details");const summary=document.createElement("summary");
      summary.textContent="Ver itens que precisam de revisão";warn.append(summary);
      const lines=document.createElement("p");lines.textContent=[...result.warnings,...result.ambiguous].slice(0,100).join(" | ");
      warn.append(lines);els.importResults.append(warn);
    }
    els.importPreview.hidden=!result.items.length;
    els.importStatus.textContent=result.items.length?"Confira os itens abaixo antes de importar.":"Nenhuma quantidade positiva foi encontrada ao lado de um produto cadastrado. Nada foi alterado.";
  } catch(error) {els.importStatus.textContent="Não foi possível ler: "+error.message;}
});
els.confirmImport.addEventListener("click",()=>{
  if(!pendingImport||pendingImport.store!==state.store){els.importStatus.textContent="A loja foi alterada. Selecione novamente o arquivo.";return;}
  if(!pendingImport.items.length)return;
  if(els.replaceImport.checked&&!confirm("Substituir todas as marcações atuais da Loja "+state.store+"?"))return;
  const next=els.replaceImport.checked?{}:{...state.selected};
  pendingImport.items.forEach(item=>{state.quantities[item.key]=item.qty;next[item.key]={category:item.category,name:item.name,qty:item.qty};});
  state.selected=next;persistCurrent();renderProducts();renderSummary();
  els.importStatus.textContent="Importação concluída na Loja "+state.store+". Confira e salve a conferência.";
  closeImport();
});
els.cancelImport.addEventListener("click",()=>{closeImport();els.importStatus.textContent="Importação cancelada.";});

// Adaptador: mantém os controles e relatórios existentes, isolando a persistência.
window.noelSync = {
  baseCatalog,
  read() {
    const history=JSON.parse(localStorage.getItem('noel-history')||'[]');
    // IDs estáveis evitam duplicar o histórico legado ao repetir uma migração.
    history.forEach((item,index)=>{if(!item.id)item.id='legacy-'+index+'-'+encodeURIComponent(item.store+'-'+item.date);});
    return {stores:Object.fromEntries(['01','02','03','04'].map(store=>[store,{
      selected:JSON.parse(localStorage.getItem(`noel-current-${store}`)||'{}'),quantities:loadQuantities(store)
    }])),catalog:JSON.parse(localStorage.getItem('noel-catalog-edits')||'{"added":[],"removed":[]}'),codes:{...productCodes},history};
  },
  apply(data) {
    for(const [store,values] of Object.entries(data.stores)){
      localStorage.setItem(`noel-current-${store}`,JSON.stringify(values.selected));
      localStorage.setItem(`noel-quantities-${store}`,JSON.stringify(values.quantities));
    }
    localStorage.setItem('noel-catalog-edits',JSON.stringify(data.catalog));
    Object.keys(productCodes).forEach(key=>delete productCodes[key]);Object.assign(productCodes,data.codes||{});
    localStorage.setItem('noel-product-codes',JSON.stringify(productCodes));
    localStorage.setItem('noel-history',JSON.stringify(data.history));
    catalogEdits.added=data.catalog.added;catalogEdits.removed=data.catalog.removed;catalogEdits.categories=data.catalog.categories||[];catalogEdits.icons=data.catalog.icons||{};applyCatalogEdits();
    state.selected=data.stores[state.store].selected;state.quantities=data.stores[state.store].quantities;
    const focused=document.activeElement;
    const editing=focused?.dataset?.qtyKey;
    const value=focused?.value;
    refreshCatalog();renderHistory();
    if(editing){const input=[...els.productList.querySelectorAll('.qty-input')].find(x=>x.dataset.qtyKey===editing);if(input){input.focus();if(input.value===value&&input.type==='text')input.setSelectionRange(value.length,value.length);}}
  }
};
