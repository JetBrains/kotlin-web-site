import Header from './header/index.jsx';
import Footer from './footer/index.jsx';
import Teach from './teach/index.jsx';
import Courses from './courses/index.jsx';
import WhyTeach from './why-teach/index.jsx';
import { initComponent, ktlHelpers } from "./ktl-helpers";
import ReleaseBanner from "./release-banner/index.jsx";

export const initComponents = () => {
  ktlHelpers().forEach(({name, node, props}) => {
    switch (name) {
      case 'header':
        initComponent(node.nextElementSibling, Header, props);
        break;
      case 'footer':
        initComponent(node.nextElementSibling, Footer, props);
        break;
      case 'teach':
        initComponent(node.nextElementSibling, Teach, props);
        break;
      case 'why-teach':
        initComponent(node.nextElementSibling, WhyTeach, props);
        break;
      case 'courses':
        initComponent(node.nextElementSibling, Courses, props);
        break;
      case 'release-banner':
        initComponent(node.nextElementSibling, ReleaseBanner, props);
        break;
      default:
        console.error(`The "${name}" component was not found.`);
        break;
    }
  });
}

