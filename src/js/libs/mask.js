import Inputmask from 'inputmask';

export function mask() {
     // телефон
    let selector = document.querySelectorAll(".tel_mask");
    if (selector) {
        var im = new Inputmask("+7 (999) 999-99-99");
        im.mask(selector);
    }

     //email mask
     let mailSelector = document.querySelectorAll(".email_mask");
     if (mailSelector) {

        Inputmask({
            mask: "*{1,64}[.*{1,64}][.*{1,64}][.*{1,64}]@*{1,255}[.*{2,6}][.*{1,2}]",
            greedy: false,
            definitions: {
                '*': {
                validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
                casing: "lower"
                }
            },
            onBeforePaste: function(pastedValue) {
                return pastedValue.toLowerCase().replace("mailto:", "").replace(/\s/g, "");
            },
            placeholder: "example@domain.com",
            clearIncomplete: true
            }).mask(mailSelector);

     }
}
mask()