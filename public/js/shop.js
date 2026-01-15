import { loadProducts, money, renderAuthUI, updateCartCount } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const products = await loadProducts();
const q = document.getElementById("q");
const cat = document.getElementById("cat");
const sort = document.getElementById("sort");
const grid = document.getElementById("grid");

const categories = [...new Set(products.map(p=>p.category))].sort();
cat.innerHTML += categories.map(c=>`<option value="${c}">${c}</option>`).join("");

function apply(){
  const query = q.value.trim().toLowerCase();
  const c = cat.value;
  const s = sort.value;

  let rows = products.filter(p=>{
    const okQ = !query || (p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    const okC = !c || p.category === c;
    return okQ && okC;
  });

  if(s === "low") rows.sort((a,b)=>a.price-b.price);
  if(s === "high") rows.sort((a,b)=>b.price-a.price);
  if(s === "az") rows.sort((a,b)=>a.name.localeCompare(b.name));

  grid.innerHTML = rows.map(p => `
    <a class="card" href="/product.html?id=${encodeURIComponent(p.id)}">
      <div class="img" style="background-image:url('${p.image}')"></div>
      <div class="cardBody">
        <div class="row">
          <div style="font-weight:800">${p.name}</div>
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ``}
        </div>
        <div class="row" style="margin-top:10px">
          <div class="muted">${p.category}</div>
          <div class="price">${money(p.price)}</div>
        </div>
      </div>
    </a>
  `).join("") || `<div class="notice">No products match your filters.</div>`;
}

[q,cat,sort].forEach(el=> el.addEventListener("input", apply));
document.getElementById("reset").addEventListener("click", ()=>{
  q.value=""; cat.value=""; sort.value="featured"; apply();
});

apply();
