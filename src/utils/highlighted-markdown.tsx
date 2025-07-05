import * as React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/languages/javascript';
import css from 'react-syntax-highlighter/dist/languages/css';
import { atomOneDark } from 'react-syntax-highlighter/dist/styles/atom-one-dark';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('css', css);

const CodeBlock = ({ className, children }) => {
    let lang = 'text'; // default monospaced text
    if (className && className.startsWith('lang-')) {
        lang = className.replace('lang-', '');
    }
    return (
        <SyntaxHighlighter language={lang} style={atomOneDark} wrapLongLines>
            {children}
        </SyntaxHighlighter>
    );
};

// markdown-to-jsx uses <pre><code/></pre> for code blocks.
export default function HighlightedPreBlock({ children, ...rest }) {
    if ('type' in children && children['type'] === 'code') {
        return CodeBlock(children['props']);
    }
    return <pre {...rest}>{children}</pre>;
}
