import { FormEvent, useEffect, useState } from 'react';

export function usePreviewForm() {
    const [ready, setReady] = useState(false);
    const [previewed, setPreviewed] = useState(false);

    useEffect(() => setReady(true), []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPreviewed(true);
    };

    return { ready, previewed, setPreviewed, handleSubmit };
}
