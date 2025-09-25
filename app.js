// app.js - simple product rendering, cart and modal
const PRODUCTS = [
  {"id":"iphone-15","title":"iPhone 15 Pro","price":1099,"desc":"Новый iPhone 15 Pro - мощный A-серии чип, потрясающий экран.","img":"images/iphone.jpg"},
  {"id":"macbook-air","title":"MacBook Air 13\"","price":1299,"desc":"Тонкий и лёгкий ноутбук с отличной автономностью.","img":"images/macbook.jpg"},
  {"id":"airpods-pro","title":"AirPods Pro","price":249,"desc":"Шумоподавление, адаптивный эквалайзер.","img":"images/airpods.jpg"},
  {"id":"apple-watch","title":"Apple Watch Series 9","price":399,"desc":"Здоровье, тренировки и стиль на запястье.","img":"images/watch.jpg"},
  {"id":"magsafe","title":"Зарядка MagSafe","price":39,"desc":"Быстрая магнитная зарядка для iPhone.","img":"images/magsafe.jpg"},
  {"id":"case","title":"Силиконовый чехол","price":29,"desc":"Защити телефон и добавь цвета.","img":"images/case.jpg"}
];

function $(s, el=document){ return el.querySelector(s) }
function $all(s, el=document){ return Array.from(el.querySelectorAll(s)) }

const productsRoot = $('#products');
const tmpl = document.getElementById('product-card-template');

function renderProducts(){
  PRODUCTS.forEach(p=>{
    const card = tmpl.content.cloneNode(true);
    const art = card.querySelector('.product-card');
    art.dataset.id = p.id;
    card.querySelector('.product-image').src = p.img;
    card.querySelector('.product-title').textContent = p.title;
    card.querySelector('.product-price').textContent = priceFormat(p.price);
    card.querySelector('.details-btn').addEventListener('click', ()=> openDetails(p));
    card.querySelector('.buy-btn').addEventListener('click', ()=> addToCart(p.id));
    productsRoot.appendChild(card);
  });
}

function priceFormat(n){ return n.toLocaleString('ru-RU',{style:'currency',currency:'USD'}).replace('US$','$') }

// Modal
const modal = $('#modal'), modalContent = $('#modal-content'), modalClose = $('.modal-close');
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal() })

function openDetails(p){
  modalContent.innerHTML = `
    <div class="product-detail">
      <img src="${p.img}" style="max-width:220px;margin:0 0 1rem 0">
      <h3>${p.title}</h3>
      <p class="small">${p.desc}</p>
      <p style="font-weight:700;margin:.6rem 0">${priceFormat(p.price)}</p>
      <div style="display:flex;gap:.5rem">
        <button class="btn buy-now">Купить</button>
        <button class="btn btn-outline" id="close-desc">Закрыть</button>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  modal.querySelector('.buy-now').addEventListener('click', ()=>{ addToCart(p.id); closeModal(); window.location.href='checkout.html' })
  modal.querySelector('#close-desc').addEventListener('click', closeModal)
}

function closeModal(){ modal.classList.add('hidden'); modalContent.innerHTML = '' }

// Cart (localStorage)
function getCart(){ return JSON.parse(localStorage.getItem('smart_cart')||'[]') }
function saveCart(c){ localStorage.setItem('smart_cart', JSON.stringify(c)); updateCartCount() }
function addToCart(id){
  const c = getCart();
  const item = c.find(i=>i.id===id);
  if(item) item.qty++;
  else c.push({id,qty:1});
  saveCart(c);
  alert('Товар добавлен в корзину');
}
function updateCartCount(){
  const sum = getCart().reduce((s,i)=>s+i.qty,0);
  $('#cart-count').textContent = sum;
}
updateCartCount();

// Init
renderProducts();