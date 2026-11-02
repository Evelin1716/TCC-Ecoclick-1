/* Página embutida (iframe): pede a navegação à página-mãe, que a repassa ao main.js. */
window.EcoNav=function(to){try{parent.postMessage({ecoNav:to},'*');}catch(e){}};
document.addEventListener('click',function(e){
  var t=e.target; if(!t||!t.closest) return;
  var n=t.closest('[data-eco-nav]');
  if(n){e.preventDefault();e.stopPropagation();window.EcoNav(n.getAttribute('data-eco-nav'));return;}
  var a=t.closest('a'); if(!a) return;
  var h=a.getAttribute('href')||'';
  if(h.charAt(0)==='#'){ e.preventDefault(); }
},true);
