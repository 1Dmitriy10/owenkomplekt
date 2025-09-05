/*
<div id="post-content"></div>

<ul id="article-navigation-anchor">
    <li class="blog-detail__nav-list-item h2">
        <a class="blog-detail__nav-list-link" href="#">
                        
        </a>
    </li>
    <li class="blog-detail__nav-list-item h3">
        <a class="blog-detail__nav-list-link" href="#">
                        
        </a>
    </li>
</ul>
*/


export function blogNavigation() {
    function getLinkSidbar() {
    
        let pageContent = document.querySelector("#post-content");
        let navList = document.querySelector("#artigle-navigation-anchor");

        if(!pageContent || !navList) {return null}

        let arrLink  = pageContent.querySelectorAll("h2, h3");

        arrLink.forEach(el=>{
           let name = el.innerText.trim();
                
                if(name != "") {
                    let id = translit(name);
                    el.id = `${id}`

                    navList.insertAdjacentHTML("beforeend", addNavItems(el))
                }
        })

        function addNavItems(el){
            let type = el.tagName;
            let id = el.id
            if(type == "H2") {
            return `
            <li class="blog-detail__nav-list-item h2">
                <a class="blog-detail__nav-list-link" href="#${id}">
                    ${el.innerText}
                </a>
            </li>
            `
            }else{
            return `
            <li class="blog-detail__nav-list-item h3">
                <a class="blog-detail__nav-list-link" href="#${id}">
                    ${el.innerText}
                </a>
            </li>
            `
            }
            
        }


    };
    getLinkSidbar();

    function translit(word) {
        var answer = '';
        var converter = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
            'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
            'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
            'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
            'ш': 'sh', 'щ': 'sch', 'ь': '_', 'ы': 'y', 'ъ': '_',
            'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '_',

            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
            'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
            'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
            'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
            'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
            'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '_', 'Ы': 'Y', 'Ъ': '_',
            'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
        };

        for (var i = 0; i < word.length; ++i) {
            if (converter[word[i]] == undefined) {
                answer += word[i];
            } else {
                answer += converter[word[i]];
            }
        }

        return answer;
    }
};
blogNavigation();