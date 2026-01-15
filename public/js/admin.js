import { renderAuthUI, updateCartCount, money } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const out = document.getElementById("out");

document.getElementById("load").addEventListener("click", async ()=>{
  const key = document.getElementById("key").value.trim();
  out.innerHTML = `<div class="notice">Loading...</div>`;

  const res = await fetch(`/api/orders?key=${encodeURIComponent(key)}`);
  const data = await res.json();

  if(!res.ok){
    out.innerHTML = `<div class="notice">Error: ${data?.error || "Failed"}</div>`;
    return;
  }

  const orders = data.orders || [];
  if(!orders.length){
    out.innerHTML = `<div class="notice">No orders yet.</div>`;
    return;
  }

  out.innerHTML = orders.map(o => `
    <div class="totalBox" style="margin-bottom:12px">
      <div class="row">
        <div style="font-weight:900">${o.id}</div>
        <span class="badge">${o.status}</span>
      </div>
      <div class="muted small" style="margin-top:6px">${new Date(o.createdAt).toLocaleString()}</div>
      <div style="margin-top:10px">
        <div class="muted small">Customer</div>
        <div>${o.customer.fullName} • ${o.customer.email}</div>
        <div class="muted small" style="margin-top:6px">Address</div>
        <div class="muted">${o.customer.address}</div>
      </div>
      <div style="margin-top:10px">
        <div class="muted small">Items</div>
        <div style="display:grid;gap:6px;margin-top:6px">
          ${(o.items||[]).map(it=>`
            <div class="row">
              <div class="muted">${it.name} (${it.color}/${it.size}) × ${it.qty}</div>
              <div>${money(it.price * it.qty)}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--line);margin:12px 0">
      <div class="row"><div class="muted">Total</div><div style="font-weight:900">${money(o.totals?.total || 0)}</div></div>
    </div>
  `).join("");
});
