import './index.scss';
import './control-pane.scss';

import {replaceByComponent, ktlHelpers, initComponent} from "../../ktl-component/ktl-helpers";
import Footer from "./footer/index.jsx";
import Header from "./header/index.jsx";
import FilterButton from "./FilterButton/index.jsx";

document.addEventListener('DOMContentLoaded', init);

function init() {
  ktlHelpers().forEach(({name, node, props}) => {
    switch (name) {
      case 'footer':
        initComponent(node.nextElementSibling, Footer, props);
        break;
      case 'header':
        initComponent(node.nextElementSibling, Header, props);
        break;
      case 'FilterButton':
        replaceByComponent(node.nextElementSibling, FilterButton, props);
        break;
      default:
        console.error(`The "${name}" component was not found.`);
        break;
    }
  });
}
