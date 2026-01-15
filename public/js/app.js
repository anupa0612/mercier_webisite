const API_BASE = ""; // same origin

export function money(n){
  return new Intl.NumberFormat(undefined, { style:"currency", currency:"USD" }).format(n || 0);
}

export function getCart(){
  try { return JSON.parse(localStorage.getItem("mercier_cart") || "[]"); }
  catch { return []; }
}

export function setCart(cart){
  localStorage.setItem("mercier_cart", JSON.stringify(cart || []));
  updateCartCount();
}

export function addToCart(item){
  const cart = getCart();
  const key = `${item.id}__${item.size}__${item.color}`;
  const found = cart.find(x => x.key === key);
  if(found) found.qty += item.qty;
  else cart.push({ ...item, key });
  setCart(cart);
}

export function removeFromCart(key){
  const cart = getCart().filter(x => x.key !== key);
  setCart(cart);
}

export function updateQty(key, qty){
  const cart = getCart();
  const it = cart.find(x => x.key === key);
  if(it){
    it.qty = Math.max(1, Number(qty || 1));
    setCart(cart);
  }
}

export function cartTotals(){
  const cart = getCart();
  const subtotal = cart.reduce((s,x)=> s + (x.price * x.qty), 0);
  const shipping = subtotal > 120 ? 0 : (cart.length ? 8 : 0);
  const tax = subtotal * 0.06;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

export function updateCartCount(){
  const el = document.querySelector("[data-cart-count]");
  if(!el) return;
  const cart = getCart();
  const count = cart.reduce((s,x)=> s + x.qty, 0);
  el.textContent = String(count);
}

export async function loadProducts(){
  const res = await fetch("/data/products.json");
  return await res.json();
}

export function getUser(){
  try { return JSON.parse(localStorage.getItem("mercier_user") || "null"); }
  catch { return null; }
}

export function setUser(user){
  localStorage.setItem("mercier_user", JSON.stringify(user));
  renderAuthUI();
}

export function logout(){
  localStorage.removeItem("mercier_user");
  renderAuthUI();
}

export function renderAuthUI(){
  updateCartCount();
  const user = getUser();
  const el = document.querySelector("[data-auth-slot]");
  if(!el) return;

  if(user){
    el.innerHTML = `
      <span class="badge">Hi, ${escapeHtml(user.name)}</span>
      <button class="btn link" id="logoutBtn">Logout</button>
    `;
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
  }else{
    el.innerHTML = `
      <a class="btn link" href="/login.html">Login</a>
      <a class="btn link" href="/register.html">Register</a>
    `;
  }
}

function escapeHtml(s){
  return String(s || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export async function placeOrder(payload){
  const res = await fetch(`${API_BASE}/api/orders`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data?.error || "Order failed");
  return data;
}
