
/* escolhe o tema antes da primeira pintura: o salvo pelo usuário ou o do aparelho */
(function(){var t=null;try{t=localStorage.getItem("ecoclick_theme");}catch(e){}
if(t!=="dark"&&t!=="light"){t=(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light";}
document.documentElement.setAttribute("data-theme",t);})();
