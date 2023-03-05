import React from "react";
import './index.scss';

const ReleaseBanner = ({params}) => {
    return (
        <a className="release-banner" href={params.url}>
            <div className="release-banner__header">
                <div className="release-banner__logo"></div>
                <div className="release-banner__header-name">Kotlin</div>
                <div className="release-banner__header-name">{params.version}</div>
                {params.versionSuffix && <div className="release-banner__header-name">{params.versionSuffix}</div>}
            </div>

            <div className="release-banner__desc">
                {params.keyFeatures.map((keyFeature, index) => <div key={index} className="release-banner__desc-item">{keyFeature}</div>)}
            </div>
        </a>
    );
};

export default ReleaseBanner;
