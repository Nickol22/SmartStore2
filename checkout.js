// checkout.js - reads cart from localStorage and allows submitting a fake order
function priceFormat(n){ return n.toLocaleString('ru-RU',{style:'currency',currency:'USD'}).replace('US$','$') }
const PRODUCTS = [{"id": "iphone-15", "title": "iPhone 15 Pro", "price": 1099, "desc": "Новый iPhone 15 Pro - мощный A-серии чип, потрясающий экран.", "img": "images/iphone.jpg"}, {"id": "macbook-air", "title": "MacBook Air 13\"", "price": 1299, "desc": "Тонкий и лёгкий ноутбук с отличной автономностью.", "img": "images/macbook.jpg"}, {"id": "airpods-pro", "title": "AirPods Pro", "price": 249, "desc": "Шумоподавление, адаптивный эквалайзер.", "img": "images/airpods.jpg"}, {"id": "apple-watch", "title": "Apple Watch Series 9", "price": 399, "desc": "Здоровье, тренировки и стиль на запястье.", "img": "images/watch.jpg"}, {"id": "magsafe", "title": "Зарядка MagSafe", "price": 39, "desc": "Быстрая магнитная зарядка для iPhone.", "img": "images/magsafe.jpg"}, {"id": "case", "title": "Силиконовый чехол", "price": 29, "desc": "Защити телефон и добавь цвета.", "img": "images/case.jpg"}];
const cartArea = document.getElementById('cart-area');
const orderForm = document.getElementById('order-form');
const orderResult = document.getElementById('order-result');

function getCart(){ return JSON.parse(localStorage.getItem('smart_cart')||'[]') }

function renderCart(){
  const cart = getCart();
  if(cart.length===0){
    cartArea.innerHTML = `<p class="small">Корзина пуста. <a href="index.html">Вернуться в каталог</a></p>`;
    orderForm.classList.add('hidden');
    return;
  }
  orderForm.classList.remove('hidden');
  let html = '<div class="cart-list">';
  let total = 0;
  cart.forEach(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const subtotal = p.price * ci.qty;
    total += subtotal;
    html += `<div class="cart-item">
      <img src="${p.img}" alt="${p.title}">
      <div class="cart-meta">
        <div><strong>${p.title}</strong></div>
        <div class="small">${priceFormat(p.price)} × ${ci.qty} = <strong>${priceFormat(subtotal)}</strong></div>
      </div>
      <div class="qty-controls">
        <button class="btn btn-outline small dec" data-id="${ci.id}">−</button>
        <button class="btn btn-outline small inc" data-id="${ci.id}">+</button>
      </div>
    </div>`;
  });
  html += `</div><div style="margin-top:1rem"><strong>Всего: ${priceFormat(total)}</strong></div>`;
  cartArea.innerHTML = html;
  attachQtyButtons();
}

function attachQtyButtons(){
  document.querySelectorAll('.inc').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.id,1)));
  document.querySelectorAll('.dec').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.id,-1)));
}

function changeQty(id, delta){
  const c = getCart();
  const item = c.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) {
    const idx = c.findIndex(i=>i.id===id);
    c.splice(idx,1);
  }
  localStorage.setItem('smart_cart', JSON.stringify(c));
  renderCart();
  try{ parent.updateCartCount && parent.updateCartCount() }catch(e){}
}

orderForm.addEventListener('submit', e=>{
  e.preventDefault();
  const form = new FormData(orderForm);
  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    name: form.get('name'),
    phone: form.get('phone'),
    address: form.get('address'),
    items: getCart()
  };
  localStorage.removeItem('smart_cart');
  renderCart();
  orderForm.classList.add('hidden');
  orderResult.classList.remove('hidden');
  orderResult.innerHTML = `<div class="order-success"><h3>Спасибо, ${order.name}!</h3><p>Ваш заказ ${order.id} принят. Мы свяжемся с вами по телефону ${order.phone}.</p><p class="small"></p><p><a href="index.html" class="btn">Вернуться в каталог</a></p></div>`;
  orderResult.scrollIntoView({behavior:'smooth'});
});

renderCart();