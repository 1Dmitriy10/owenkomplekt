/*
cтруктура
<div class="_tabs-js">
        <div class="tabs__title-box">
            <span class="tabs__title">первая вкладка</span>
            <span class="tabs__title">вторая вкладка</span>
            <span class="tabs__title">третья вкладка</span>
        </div>
        <div class="tabs__item-box">
            <div class="tabs__item">
            </div>
            <div class="tabs__item">
            </div>
            <div class="tabs__item">
            </div>
        </div>
    </div>
*/

import { Tabs } from "../vendor/tabs.js"

export const productTabs = new Tabs({ class: "product_tabs-js" })
