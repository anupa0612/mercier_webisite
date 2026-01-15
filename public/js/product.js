import { loadProducts, money, addToCart, renderAuthUI, updateCartCount } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const params = new URLSearchParams(location.search);
const id = params.get("id");

const products = await loadProducts();
const p = products.find(x => x.id === id);
const wrap = document.getElementById("wrap");

if(!p){
  wrap.innerHTML = `<div class="notice">Product not found. <a class="btn link" href="/shop.html">Back to shop</a></div>`;
}else{
  wrap.innerHTML = `
    <div class="split">
      <div class="card">
        <div class="img" style="background-image:url('${p.image}'); aspect-ratio: 4/3;"></div>
      </div>

      <div class="card">
        <div class="cardBody grid">
          <div class="row top">
            <div>
              <div class="muted">${p.category}</div>
              <h2 style="margin:6px 0 0">${p.name}</h2>
            </div>
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ``}
          </div>

          <div class="price" style="font-size:22px">${money(p.price)}</div>
          <div class="muted">${p.description}</div>

          <div class="split">
            <div>
              <label class="muted small">Color</label>
              <select id="color">${p.colors.map(c=>`<option>${c}</option>`).join("")}</select>
            </div>
            <div>
              <label class="muted small">Size</label>
              <select id="size">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
            </div>
          </div>

          <div class="split">
            <div>
              <label class="muted small">Quantity</label>
              <input class="input" id="qty" type="number" value="1" min="1"/>
            </div>
            <div style="display:flex;align-items:end">
              <button class="btn primary" id="add">Add to Cart</button>
            </div>
          </div>

          <div class="notice" id="msg" style="display:none"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("add").addEventListener("click", ()=>{
    const color = document.getElementById("color").value;
    const size = document.getElementById("size").value;
    const qty = Number(document.getElementById("qty").value || 1);

    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      color, size, qty
    });

    const msg = document.getElementById("msg");
    msg.style.display = "block";
    msg.innerHTML = `Added to cart. <a class="btn link" href="/cart.html">Go to cart →</a>`;
  });
}
