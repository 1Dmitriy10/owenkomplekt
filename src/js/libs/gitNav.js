import { 
  rollupInputs, 
  relativePaths, 
  pageKeys, 
  getPagePath, 
  getPageRelativePath,
  hasPage 
} from './rollup-inputs.js';

export function gitNav() {
    let block = document.querySelector(".git-nav-box");
    let ul = document.querySelector(".git-nav-box>ul");
    let check = false;
    let path = 'https://1dmitriy10.github.io/owenkomplekt/';
    
    block.addEventListener("click", function() {
        block.classList.toggle("show");
    })

    if(check) {
        block.style.cssText=`right:-100%`;    
      }
 

   for (const key in rollupInputs) {
    let parts = rollupInputs[key].replace(/\\/g, '/').split('/'),
    lastPart = parts.pop(),
    href = lastPart,
    name = key
    ul.insertAdjacentHTML("beforeend", addLiItem(name,href))
   }

    

    function addLiItem(name,href){
      return `
      <li>
        <a href="${path}${href}">
          ${name}
        </a>
      </li>
      `
    }
       };
    gitNav();

