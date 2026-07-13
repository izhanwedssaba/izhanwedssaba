// main.js - Vanilla JS for opening animation, countdown, and blessings (local only)
(function(){
  // DOM
  const overlay = document.getElementById('overlay');
  const monogram = document.getElementById('monogram');
  const blessForm = document.getElementById('blessForm');
  const blessList = document.getElementById('blessList');
  const blessFeedback = document.getElementById('blessFeedback');

  // Show opening animation then hide overlay
  function startIntro(){
    overlay.classList.add('show');
    // After 2.4s hide overlay with elegant fade
    setTimeout(()=>{
      overlay.classList.add('hide');
      // remove from flow after animation
      setTimeout(()=>overlay.remove(),800);
    },2400);
  }

  // Countdown timer
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  // Target: 18 October 2026 (local timezone) - midnight start of day
  const targetDate = new Date('2026-10-18T00:00:00');

  function updateCountdown(){
    const now = new Date();
    const diff = targetDate - now;
    if(diff <= 0){
      daysEl.textContent = '00'; hoursEl.textContent='00'; minsEl.textContent='00'; secsEl.textContent='00';
      clearInterval(timerInterval);
      return;
    }
    const s = Math.floor(diff/1000);
    const days = Math.floor(s/86400);
    const hours = Math.floor((s%86400)/3600);
    const minutes = Math.floor((s%3600)/60);
    const seconds = s%60;
    daysEl.textContent = String(days).padStart(2,'0');
    hoursEl.textContent = String(hours).padStart(2,'0');
    minsEl.textContent = String(minutes).padStart(2,'0');
    secsEl.textContent = String(seconds).padStart(2,'0');
  }

  const timerInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // Blessings - local storage
  const STORAGE_KEY = 'wedding_blessings_izhan_bazila';

  function loadBlessings(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      blessList.innerHTML = '';
      arr.slice().reverse().forEach(item=>{
        const li = document.createElement('li');
        li.innerHTML = `<strong>${escapeHtml(item.name)}</strong><div class="muted small">${escapeHtml(item.time)}</div><div>${escapeHtml(item.message)}</div>`;
        blessList.appendChild(li);
      });
    }catch(e){console.warn('bless load',e)}
  }

  function saveBlessing(name,msg){
    const now = new Date();
    const time = now.toLocaleString();
    const entry = {name:name,message:msg,time};
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      loadBlessings();
    }catch(e){console.warn('save bless',e)}
  }

  blessForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = (document.getElementById('name').value || 'Anonymous').trim();
    const msg = (document.getElementById('message').value || '').trim();
    if(!msg){
      blessFeedback.textContent = 'Please enter a message.';
      return;
    }
    saveBlessing(name,msg);
    blessFeedback.textContent = 'Blessing saved locally.';
    blessForm.reset();
    setTimeout(()=>blessFeedback.textContent='',2000);
  });

  // Small menu toggle for mobile
  const menuToggle = document.getElementById('menuToggle');
  if(menuToggle){
    menuToggle.addEventListener('click', ()=>{
      const nav = document.querySelector('.nav-links');
      if(nav.style.display === 'flex') nav.style.display='none'; else nav.style.display='flex';
    });
  }

  // Escape HTML for blessings
  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Kick off
  document.addEventListener('DOMContentLoaded', ()=>{
    startIntro();
    loadBlessings();
  });
})();
