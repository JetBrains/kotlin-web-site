import './index.scss';
import { initComponent, ktlHelpers } from "../../ktl-component/ktl-helpers";
import Footer from "./footer/index.jsx";

document.addEventListener('DOMContentLoaded', init);

function init() {
  ktlHelpers().forEach(({name, node, props}) => {
    switch (name) {
      case 'footer':
        initComponent(node.nextElementSibling, Footer, props);
        break;
      default:
        console.error(`The "${name}" component was not found.`);
        break;
    }
  });
}