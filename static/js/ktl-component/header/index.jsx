import React from "react";
import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import searchConfig from '../../../../search-config.json';

const Header = (props) => {
  return (
      <GlobalHeader { ... props } searchConfig={searchConfig} />
  );
}

export default Header;
