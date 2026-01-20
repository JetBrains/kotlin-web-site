import { extendedMarkdown, GrammarMarkdown } from './markdown';

import styles from './grammar.module.css';

import {
    GrammarAnnotationType,
    GrammarDeclarationType,
    GrammarDescriptionType,
    GrammarDocType,
    GrammarItemType,
    GrammarSetType,
    GrammarTextType,
    GrammarTokenType,
    GrammarUsagesType,
    GrammarXMLType
} from './entities';
import { ReactNode } from 'react';

/**
 * Main Grammar component that renders the grammar documentation page.
 * Displays a formatted view of grammar rules parsed from XML data.
 *
 * @param data - Array of grammar tokens representing the complete grammar structure
 */
export function Grammar({ data }: { data: GrammarXMLType }) {
    return <div className={styles.grammar}>
        <div className={'ktl-layout-v2 ktl-layout--center'}>
            <h1 id="grammar">Grammar</h1>
            <GrammarToken data={data} />
        </div>
    </div>;
}

/**
 * Polymorphic component that renders different grammar token types.
 * Acts as a dispatcher, checking the token type and delegating to the appropriate
 * specialized component.
 */
function GrammarToken({ data }: { data: GrammarTokenType | GrammarTokenType[] }) {
    // Handle arrays by recursively rendering each item
    if (Array.isArray(data)) return <>
        {data.map((item) => <GrammarToken data={item} />)}
    </>;

    // Type discrimination: check which property exists and render accordingly
    if ('set' in data) return <GrammarSet data={data} />;
    if ('doc' in data) return <GrammarDoc data={data} />;
    if ('item' in data) return <GrammarItem data={data} />;
    if ('annotation' in data) return <GrammarAnnotate data={data} />;
    if ('declaration' in data) return <GrammarDeclaration data={data} />;
    if ('description' in data) return <GrammarDescription data={data} />;
    if ('usages' in data) return <GrammarUsages data={data} />;
    if ('#text' in data) return <GrammarText data={data['#text']} />;

    return null;
}

/** Renders plain text content as Markdown. */
function GrammarText({ data }: { data: string }) {
    return <GrammarMarkdown>{data}</GrammarMarkdown>;
}

/**
 * Renders a set of grammar items from a single source file.
 * Groups related grammar rules together with a file reference.
 */
function GrammarSet({ data }: { data: GrammarSetType }) {
    return <div className={'grammar-items-set'} data-file-name={data[':@']['@_file-name']}>
        <GrammarToken data={data.set} />
    </div>;
}

/** Renders documentation/comment blocks for grammar rules. */
function GrammarDoc({ data }: { data: GrammarDocType }) {
    return <div className={'grammar-comment'}>
        <GrammarToken data={data.doc} />
    </div>;
}

/** Renders a single grammar item (a complete grammar rule with all its parts). */
function GrammarItem({ data }: { data: GrammarItemType }) {
    return <div className={'grammar-item'}>
        <GrammarToken data={data.item} />
    </div>;
}

/** Renders annotations that provide metadata or additional information about grammar rules. */
function GrammarAnnotate({ data }: { data: GrammarAnnotationType }) {
    return <div className={'grammar-annotation'}><GrammarMarkdown>{text(data.annotation)}</GrammarMarkdown></div>;
}

/**
 * Renders the description/definition of a grammar rule.
 * Handles different token types (strings, symbols, identifiers, line breaks) and
 * formats them appropriately with syntax highlighting.
 */
function GrammarDescription({ data }: { data: GrammarDescriptionType }) {
    return <div className={'grammar-description'}>
        {data.description.map((token) => {
            // String literals in the grammar
            if ('string' in token) {
                return <span className={'grammar-string'}>{text(token.string)}</span>;
            }
            // Symbols like operators or punctuation
            if ('symbol' in token) {
                return <span className={'grammar-symbol'}>{text(token.symbol)}</span>;
            }
            // References to other grammar rules (rendered as links)
            if ('identifier' in token) {
                const name = token[':@']['@_name'];
                return <a className={'grammar-identifier-name'} href={`#${name}`}>{name}</a>;
            }
            // Line breaks
            if ('crlf' in token) {
                return <br />;
            }
            // Other text content
            if ('other' in token) {
                return token.other.map((part) => <span className={'grammar-other'}>
                    <GrammarMarkdown>{part['#text']}</GrammarMarkdown>
                </span>);
            }
            return null;
        })}
    </div>;
}

/**
 * Renders a grammar rule declaration with its name as an anchor point.
 * The name can be linked to from other parts of the documentation.
 */
function GrammarDeclaration({ data }: { data: GrammarDeclarationType }) {
    const name = data[':@']['@_name'];

    return <div className={'grammar-declaration'}>
        {/* Render the rule name as both visible text and a linkable anchor */}
        <div className={'grammar-declaration-name'} id={name}>{name}</div>
        <GrammarToken data={data.declaration} />
    </div>;
}

/**
 * Renders a list of grammar rules that use/reference this declaration.
 * Shows "used by X, Y, Z" with links to each usage.
 */
function GrammarUsages({ data }: { data: GrammarUsagesType }) {
    const used = data.usages.map((usage, index, list) => {
        const name = usage.declaration[0]['#text'];
        return <>
            <a href={`#${name}`}>{name}</a>
            {index < list.length - 1 && ', '}
        </>;
    });

    return <div className={'grammar-declaration-usedby'}>{'\u00A0'}(used by {used})</div>;
}

function text(token: GrammarTextType[]): ReactNode {
    return <>{(token[0]['#text'] || '').split('&nbsp;').map((part, index, list) => <>
        {extendedMarkdown(part)}
        {/* Convert &nbsp; entities to actual non-breaking space characters */}
        {index < list.length - 1 && '\u00A0'}
    </>)}</>;
}