export function gitNav() {
    let block = document.querySelector(".git-nav-box");
    let check = true;
    
    block.addEventListener("click", function() {
        block.classList.toggle("show");
    })

    if(check) {
        block.style.cssText=`right:-100%`;    }
    };
    gitNav();

// src/js/libs/gitNav.js
// export function gitNav() {
//   // Импортируем как строки — чтобы Vite "увидел" файлы
//   const modules = import.meta.glob('/src/html/**/*.html', {
//     eager: true,
//     as: 'raw'
//   });

//   const block = document.querySelector('.git-nav-box');
//   if (!block) return;

//   block.innerHTML = '';
//   const ul = document.createElement('ul');
//   ul.style.listStyle = 'none';
//   ul.style.padding = '0';
//   ul.style.margin = '0';

//   const paths = Object.keys(modules);
//   if (paths.length === 0) {
//     console.warn('Нет HTML-файлов в /src/html/');
//     return;
//   }

//   paths.forEach(path => {
//     const name = path.split('/').pop().replace(/\.html$/, '');
//     const url = path.replace(/^\/src\/html/, ''); // → /about.html

//     const li = document.createElement('li');
//     const a = document.createElement('a');
//     a.href = url;
//     a.textContent = name.charAt(0).toUpperCase() + name.slice(1);
//     a.style.display = 'block';
//     a.style.padding = '8px';
//     a.style.textDecoration = 'none';
//     a.style.color = '#007bff';

//     li.appendChild(a);
//     ul.appendChild(li);
//   });

//   block.appendChild(ul);
// }

// gitNav();