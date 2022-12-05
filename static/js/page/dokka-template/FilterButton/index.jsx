import cn from 'classnames';
import Button from "@rescui/button";
import  useMediaMatch from "use-match-media-hook";

import "./filter-button.scss";

function FilterButton({ className, children: name, ...props }) {
    const [isSmall] = useMediaMatch([ "(max-width: 840px)" ]);
    const elClassName = cn(className, 'ktl-dokka-filter-button', `ktl-dokka-filter-button_${name}`);
    return <Button size={isSmall ? 'xs' : 'm'} {...props} mode="clear" theme="dark" className={elClassName}>{name}</Button>;
}

export default FilterButton;
