/** Represents XML attributes with a name property */
type GrammarAttrNameType = { ':@': { '@_name': string } };

/** Represents a text node from the parsed XML */
export type GrammarTextType = { '#text': string };

/** Represents a set of grammar items grouped by file */
export type GrammarSetType = { set: GrammarTokenType[], ':@': { '@_file-name': string } };

/** Represents a grammar rule declaration with a name */
export type GrammarDeclarationType = { declaration: GrammarTokenType[] } & GrammarAttrNameType;

/** Represents usage references showing where a declaration is used */
export type GrammarUsagesType = { usages: { declaration: GrammarTextType[] }[] };

/** Represents an identifier token in a grammar description */
type GrammarIdentifierType = { identifier: [] } & GrammarAttrNameType;

/** Union type for different token types that can appear in grammar descriptions */
type GrammarDescriptionToken =
    { string: GrammarTextType[] }      // String literals in grammar
    | { symbol: GrammarTextType[] }    // Symbols like operators
    | { other: GrammarTextType[] }     // Other text content
    | GrammarIdentifierType        // References to other grammar rules
    | { crlf: [] };                // Line breaks

/** Represents the description/definition of a grammar rule */
export type GrammarDescriptionType = { description: GrammarDescriptionToken[] };

/** Represents an annotation on a grammar rule */
export type GrammarAnnotationType = { annotation: GrammarTextType[] }

/** Represents documentation/comments for grammar rules */
export type GrammarDocType = { doc: GrammarTextType[] }

/** Represents a single grammar item containing rules */
export type GrammarItemType = { item: GrammarTokenType[] }

/** Union type representing any possible grammar token type */
export type GrammarTokenType =
    GrammarDocType
    | GrammarItemType
    | GrammarAnnotationType
    | GrammarDeclarationType
    | GrammarDescriptionType
    | GrammarSetType
    | GrammarTextType
    | GrammarUsagesType;

/** Root type representing the complete grammar XML structure */
export type GrammarXMLType = GrammarTokenType[];