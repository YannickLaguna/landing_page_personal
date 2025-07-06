import * as React from 'react';

const CodeBlock = ({ className, children }) => {
    let lang = 'text'; // default monospaced text
    if (className && className.startsWith('lang-')) {
        lang = className.replace('lang-', '');
    }
    
    return (
        <pre 
            className={`language-${lang}`}
            style={{
                backgroundColor: '#f6f8fa',
                color: '#24292e',
                padding: '16px',
                borderRadius: '6px',
                fontSize: '14px',
                lineHeight: '1.45',
                overflow: 'auto',
                border: '1px solid #e1e4e8',
                fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace'
            }}
        >
            <code>{children}</code>
        </pre>
    );
};

// markdown-to-jsx uses <pre><code/></pre> for code blocks.
export default function HighlightedPreBlock({ children, ...rest }) {
    if ('type' in children && children['type'] === 'code') {
        return CodeBlock(children['props']);
    }
    return <pre {...rest}>{children}</pre>;
}
