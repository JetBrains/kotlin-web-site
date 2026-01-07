import React from 'react';
import { CodeHighlight } from '../../../components/code-highlight/code-highlight';

import styles from './code-block.module.css';

interface CodeBlockProps {
    codeSample: string;
    imageSrc: ImgSrc;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ codeSample, imageSrc }) => (
    <div>
        <img src={imageSrc.src} alt="" className={styles.image} />

        <CodeHighlight code={codeSample} className={styles.code} />
    </div>
);