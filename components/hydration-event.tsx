import { useEffect } from "react";

export default function HydrationEvent() {
    useEffect(() => {
        document.documentElement.classList.add("hydrated");
        window.dispatchEvent(new Event('react:hydrated'));
    }, []);
    return null;
}
