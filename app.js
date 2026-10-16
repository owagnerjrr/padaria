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

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const categoryIcons = ["▦","🧁","🥟","🍮","🥖","🌿","🥩","🍕"];
function renderFilters() {
  const categories = ["Todos", ...Object.keys(catalog)];
  els.categoryFilters.innerHTML = categories.map((cat, i) => `<button class="chip ${state.category === cat ? "active" : ""}" data-category="${cat}"><span class="chip-icon" aria-hidden="true">${categoryIcons[i]}</span> ${cat}</button>`).join("");
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
    const matches = catalog[category].filter(name => (!query || normalize(name).includes(query)) && (!state.onlySelected || !!state.selected[keyFor(category,name)]));
    if (!matches.length) return;
    html += `<div class="category-title">${category}</div>`;
    html += matches.map(name => {
      const key = keyFor(category, name);
      const item = state.selected[key];
      const checked = Boolean(item);
      const qty = state.quantities[key] ?? item?.qty ?? "";
      const unit = /(?:\bkg\b|\bquilo\b)/i.test(name) ? "kg" : "un.";
      const safeQty = String(qty).replace(/[^0-9.,]/g,"");
      return `<div class="product-row ${checked ? "selected" : ""}">
        <input type="checkbox" aria-label="Selecionar ${name}" data-key="${encodeURIComponent(key)}" ${checked ? "checked" : ""} />
        <span class="product-name">${name}</span>
        <span class="qty-wrap">
          <input class="qty-input" aria-label="Quantidade de ${name}" data-qty-key="${encodeURIComponent(key)}" type="number" min="0" step="any" inputmode="decimal" placeholder="Qtd." value="${safeQty}" />
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
  localStorage.setItem(`noel-quantities-${state.store}`, JSON.stringify(state.quantities));
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
  state.quantities = loadQuantities(state.store);
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

els.clearQuantitiesButton.addEventListener("click", () => {
  const hasQuantities = Object.values(state.quantities).some(value => String(value ?? "").trim() !== "");
  if (!hasQuantities) {
    els.savedMessage.textContent = "Não há quantidades preenchidas para zerar nesta loja.";
    return;
  }
  state.quantities = {};
  Object.values(state.selected).forEach(item => { item.qty = ""; });
  persistCurrent();
  renderProducts();
  renderSummary();
  els.savedMessage.textContent = "Quantidades da Loja " + state.store + " zeradas. Seleções preservadas.";
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
    ["Categoria", "Produto", "Quantidade", "Unidade"]
  ];
  items.forEach(item => {
    const raw = String(item.qty ?? "").trim().replace(",", ".");
    rows.push([item.category,item.name,raw !== "" && Number.isFinite(Number(raw)) ? Number(raw) : "",itemUnit(item)]);
  });
  rows.push([],["Total de produtos",items.length]);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{wch:20},{wch:48},{wch:16},{wch:12}];
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
  if (!/^\\d+(?:[.,]\\d+)?$/.test(raw)) return null;
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
  closeImport();
  const file=e.target.files?.[0];
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
