// public/js/checkout.js
import { getCart, cartTotals, money, placeOrder, setCart, renderAuthUI, updateCartCount, getUser } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const cart = getCart();
const t = cartTotals();

const summary = document.getElementById("summary");
summary.innerHTML = `
  <div style="font-weight:900;font-size:18px">Order Summary</div>
  <div class="muted small" style="margin-top:6px">${cart.length} item(s)</div>
  <div style="margin-top:10px;display:grid;gap:10px">
    ${cart.map(it => `
      <div class="row">
        <div class="muted">${it.name} (${it.color}/${it.size}) × ${it.qty}</div>
        <div>${money(it.price * it.qty)}</div>
      </div>
    `).join("") || `<div class="notice">Cart is empty.</div>`}
  </div>
  <hr style="border:none;border-top:1px solid var(--line);margin:12px 0">
  <div class="row"><span class="muted">Subtotal</span><span>${money(t.subtotal)}</span></div>
  <div class="row"><span class="muted">Shipping</span><span>${money(t.shipping)}</span></div>
  <div class="row"><span class="muted">Tax</span><span>${money(t.tax)}</span></div>
  <div class="row" style="margin-top:6px"><span style="font-weight:900">Total</span><span style="font-weight:900">${money(t.total)}</span></div>
`;

const user = getUser();
if(user){
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
}

document.getElementById("place").addEventListener("click", async ()=>{
  const msg = document.getElementById("msg");
  msg.style.display = "none";
  msg.textContent = "";

  if(cart.length === 0){
    msg.style.display = "block";
    msg.textContent = "Your cart is empty.";
    return;
  }

  const fullName = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if(!fullName || !email || !address){
    msg.style.display = "block";
    msg.textContent = "Please fill Full name, Email and Address.";
    return;
  }

  try{
    const payload = {
      customer: { fullName, email, phone, city, address, notes },
      items: cart,
      totals: t
    };
    const res = await placeOrder(payload);

    // Store last order id for Orders page
    localStorage.setItem("mercier_last_order", res.orderId);

    // Clear cart
    setCart([]);
    msg.style.display = "block";
    msg.innerHTML = `Order placed successfully. Your order ID is <b>${res.orderId}</b>. <a class="btn link" href="/orders.html">View Orders →</a>`;
    updateCartCount();
  }catch(e){
    msg.style.display = "block";
    msg.textContent = e.message || "Order failed.";
  }
});
