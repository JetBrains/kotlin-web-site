import React from "react";
import cn from 'classnames';
import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { SearchResultView } from '@jetbrains/kotlin-web-site-ui/out/components/header/header';
import searchConfig from '../../../../../search-config.json';

import './header.scss';

const Header = (props) => (
  <GlobalHeader
    {...props}
    className={cn(props.className, 'ktl-dokka-header')}
    hasSearch={true}
    searchConfig={{
      ...searchConfig,
      searchAlgoliaIndexName: process.env.ALGOLIA_INDEX_NAME || searchConfig.searchAlgoliaIndexName,
    }}
    noScrollClassName={'_no-scroll'}
    hasBorder={false}
    resultViewType={SearchResultView.Wide}
  />
);

export default Header;
