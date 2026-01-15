// public/js/cart.js
import { getCart, money, removeFromCart, updateQty, cartTotals, renderAuthUI, updateCartCount } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const cartArea = document.getElementById("cartArea");
const totalsBox = document.getElementById("totals");

function render(){
  const cart = getCart();
  const t = cartTotals();

  cartArea.innerHTML = cart.length ? `
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Options</th>
          <th>Qty</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(it => `
          <tr>
            <td>
              <div style="display:flex;gap:10px;align-items:center">
                <div style="width:54px;height:54px;border-radius:12px;border:1px solid var(--line);background:url('${it.image}') center/cover"></div>
                <div>
                  <div style="font-weight:800">${it.name}</div>
                  <div class="muted small">${it.id}</div>
                </div>
              </div>
            </td>
            <td class="muted">${it.color} • ${it.size}</td>
            <td style="width:110px">
              <input class="input" type="number" min="1" value="${it.qty}" data-qty="${it.key}"/>
            </td>
            <td class="price">${money(it.price * it.qty)}</td>
            <td style="width:90px">
              <button class="btn danger" data-rm="${it.key}">Remove</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : `<div class="notice">Your cart is empty.</div>`;

  totalsBox.innerHTML = `
    <div style="font-weight:900;font-size:18px">Summary</div>
    <div class="row" style="margin-top:10px"><span class="muted">Subtotal</span><span>${money(t.subtotal)}</span></div>
    <div class="row"><span class="muted">Shipping</span><span>${money(t.shipping)}</span></div>
    <div class="row"><span class="muted">Tax</span><span>${money(t.tax)}</span></div>
    <hr style="border:none;border-top:1px solid var(--line);margin:12px 0">
    <div class="row"><span style="font-weight:900">Total</span><span style="font-weight:900">${money(t.total)}</span></div>
    <div style="margin-top:12px;display:grid;gap:10px">
      <a class="btn primary" href="/checkout.html">Proceed to Checkout</a>
    </div>
    <div class="notice" style="margin-top:12px">
      Shipping is free for orders over $120.
    </div>
  `;

  document.querySelectorAll("[data-rm]").forEach(b=>{
    b.addEventListener("click", ()=>{
      removeFromCart(b.getAttribute("data-rm"));
      render();
    });
  });

  document.querySelectorAll("[data-qty]").forEach(inp=>{
    inp.addEventListener("input", ()=>{
      updateQty(inp.getAttribute("data-qty"), inp.value);
      render();
    });
  });
}

render();
