
(function(){var t='light';try{var s=localStorage.getItem('ecoclick_theme');
if(s==='dark'||(s==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))t='dark';}catch(e){}
document.documentElement.setAttribute('data-theme',t);})();
