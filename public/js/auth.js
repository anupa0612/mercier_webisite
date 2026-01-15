import { setUser, renderAuthUI, updateCartCount } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

function show(msg){
  const el = document.getElementById("msg");
  el.style.display = "block";
  el.textContent = msg;
}

const isLogin = location.pathname.endsWith("login.html");
const isRegister = location.pathname.endsWith("register.html");

if(isLogin){
  document.getElementById("login").addEventListener("click", ()=>{
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();
    if(!email || !pass) return show("Enter email and password.");

    // Demo auth (local only)
    setUser({ name: email.split("@")[0], email });
    location.href = "/shop.html";
  });
}

if(isRegister){
  document.getElementById("register").addEventListener("click", ()=>{
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();
    if(!name || !email || !pass) return show("Fill all fields.");

    // Demo auth (local only)
    setUser({ name, email });
    location.href = "/shop.html";
  });
}
