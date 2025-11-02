import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export function fancybox() {
    Fancybox.bind()
    window.Fancybox = Fancybox;
}
fancybox()