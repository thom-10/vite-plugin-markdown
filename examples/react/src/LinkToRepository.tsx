import React, { ReactNode } from 'react';

export default function LinkToRepository({
    color,
    children,
}: {
    color: string;
    children: ReactNode;
}) {
    const style = { color: color || '#eee' };
    return (
        <a
            href="https://github.com/hmsk/vite-plugin-markdown"
            target="_blank"
            style={style}
        >
            {children}
        </a>
    );
}
