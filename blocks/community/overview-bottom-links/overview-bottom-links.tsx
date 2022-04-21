import React, {FC} from "react";
import {TextWithImageBlock} from "../../../components/text-with-image-block/text-with-image-block";

import kugMascot1 from './images/kug-maskot1.svg';
import kugMascot2 from './images/kug-maskot2.svg';

export const OverviewBottomLinks: FC = () => {
    return (
        <>
            <TextWithImageBlock title={"Join a Kotlin User Group\nor start your own"} buttonLink={"/user-groups/user-group-list.html"}
                                buttonTitle={"All KUGs →"} imageSrc={kugMascot1}/>
            <TextWithImageBlock title={"Get inspired at a Kotlin event\nor host one yourself"} buttonLink={"/community/events.html"}
                                buttonTitle={"Talks and Events →"} imageSrc={kugMascot2} reversed/>
        </>
    );
};
