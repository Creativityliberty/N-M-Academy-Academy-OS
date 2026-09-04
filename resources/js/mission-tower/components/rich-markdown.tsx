import { Check, Copy } from 'lucide-react';
import {
    Fragment,
    type ReactNode,
    useMemo,
    useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
    content: string;
    className?: string;
};

type CodeToken = {
    text: string;
    kind: 'plain' | 'keyword' | 'string' | 'number' | 'comment';
};

const keywordSet = new Set([
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'for',
    'while',
    'class',
    'public',
    'private',
    'protected',
    'readonly',
    'new',
    'true',
    'false',
    'null',
    'undefined',
    'async',
    'await',
    'import',
    'from',
    'export',
    'default',
    'interface',
    'type',
    'extends',
    'implements',
    'try',
    'catch',
    'throw',
    'match',
    'use',
    'namespace',
    'declare',
    'strict_types',
]);

export function sanitizeUrl(value: string): string | null {
    const url = value.trim();

    if (url.startsWith('/') || url.startsWith('#')) {
        return url;
    }

    try {
        const parsed = new URL(url);
        if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
            return url;
        }
    } catch {
        return null;
    }

    return null;
}

function tokenizeCode(code: string): CodeToken[] {
    const tokens: CodeToken[] = [];
    const matcher = /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)/g;
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = matcher.exec(code)) !== null) {
        if (match.index > cursor) {
            tokens.push({ text: code.slice(cursor, match.index), kind: 'plain' });
        }

        const text = match[0];
        let kind: CodeToken['kind'] = 'plain';
        if (match[1]) kind = 'comment';
        else if (match[2]) kind = 'string';
        else if (match[3]) kind = 'number';
        else if (keywordSet.has(text)) kind = 'keyword';

        tokens.push({ text, kind });
        cursor = matcher.lastIndex;
    }

    if (cursor < code.length) {
        tokens.push({ text: code.slice(cursor), kind: 'plain' });
    }

    return tokens;
}

function CodeCopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copy}
            className="h-8 gap-1.5 px-2 text-xs text-muted-foreground"
        >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? 'Copié' : 'Copier'}
        </Button>
    );
}

export function renderCodeBlock(code: string, language = ''): ReactNode {
    const tokens = tokenizeCode(code);

    return (
        <div className="my-4 overflow-hidden rounded-2xl border border-border/70 bg-muted/35">
            <div className="flex items-center justify-between gap-3 border-b border-border/70 px-3 py-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {language || 'code'}
                </span>
                <CodeCopyButton code={code} />
            </div>
            <pre className="overflow-x-auto p-4 text-[13px] leading-6">
                <code>
                    {tokens.map((token, index) => (
                        <span
                            key={`${index}-${token.text.slice(0, 8)}`}
                            className={cn(
                                token.kind === 'keyword' && 'font-semibold text-brand-primary',
                                token.kind === 'string' && 'text-emerald-700 dark:text-emerald-300',
                                token.kind === 'number' && 'text-violet-700 dark:text-violet-300',
                                token.kind === 'comment' && 'text-muted-foreground italic',
                            )}
                        >
                            {token.text}
                        </span>
                    ))}
                </code>
            </pre>
        </div>
    );
}

function findClosing(text: string, marker: string, start: number): number {
    return text.indexOf(marker, start + marker.length);
}

export function parseInline(text: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    let cursor = 0;

    const pushPlain = (value: string) => {
        if (value !== '') nodes.push(value);
    };

    while (cursor < text.length) {
        if (text.startsWith('**', cursor)) {
            const end = findClosing(text, '**', cursor);
            if (end > cursor + 2) {
                nodes.push(
                    <strong key={`strong-${cursor}`} className="font-semibold text-foreground">
                        {parseInline(text.slice(cursor + 2, end))}
                    </strong>,
                );
                cursor = end + 2;
                continue;
            }
        }

        if (text.startsWith('~~', cursor)) {
            const end = findClosing(text, '~~', cursor);
            if (end > cursor + 2) {
                nodes.push(
                    <span key={`strike-${cursor}`} className="line-through decoration-muted-foreground/70">
                        {parseInline(text.slice(cursor + 2, end))}
                    </span>,
                );
                cursor = end + 2;
                continue;
            }
        }

        if (text[cursor] === '*' || text[cursor] === '_') {
            const marker = text[cursor];
            const end = text.indexOf(marker, cursor + 1);
            if (end > cursor + 1) {
                nodes.push(
                    <em key={`em-${cursor}`} className="italic">
                        {parseInline(text.slice(cursor + 1, end))}
                    </em>,
                );
                cursor = end + 1;
                continue;
            }
        }

        if (text[cursor] === '`') {
            const end = text.indexOf('`', cursor + 1);
            if (end > cursor + 1) {
                nodes.push(
                    <code
                        key={`code-${cursor}`}
                        className="rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[0.9em]"
                    >
                        {text.slice(cursor + 1, end)}
                    </code>,
                );
                cursor = end + 1;
                continue;
            }
        }

        if (text[cursor] === '[') {
            const labelEnd = text.indexOf(']', cursor + 1);
            const hrefStart = labelEnd >= 0 && text[labelEnd + 1] === '(' ? labelEnd + 2 : -1;
            const hrefEnd = hrefStart >= 0 ? text.indexOf(')', hrefStart) : -1;
            if (labelEnd > cursor && hrefStart >= 0 && hrefEnd > hrefStart) {
                const href = sanitizeUrl(text.slice(hrefStart, hrefEnd));
                const label = text.slice(cursor + 1, labelEnd);
                if (href) {
                    const external = href.startsWith('http://') || href.startsWith('https://');
                    nodes.push(
                        <a
                            key={`link-${cursor}`}
                            href={href}
                            target={external ? '_blank' : undefined}
                            rel={external ? 'noreferrer noopener' : undefined}
                            className="font-medium text-brand-primary underline decoration-brand-primary/30 underline-offset-4 hover:decoration-brand-primary"
                        >
                            {label}
                        </a>,
                    );
                } else {
                    pushPlain(text.slice(cursor, hrefEnd + 1));
                }
                cursor = hrefEnd + 1;
                continue;
            }
        }

        let next = text.length;
        for (const marker of ['**', '~~', '*', '_', '`', '[']) {
            const index = text.indexOf(marker, cursor + 1);
            if (index >= 0 && index < next) next = index;
        }
        pushPlain(text.slice(cursor, next));
        cursor = next;
    }

    return nodes;
}

function splitTableRow(line: string): string[] {
    return line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
    const cells = splitTableRow(line);
    return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

export function renderTable(lines: string[], key: string): ReactNode {
    const headers = splitTableRow(lines[0]);
    const rows = lines.slice(2).map(splitTableRow);

    return (
        <div key={key} className="my-4 overflow-x-auto rounded-2xl border border-border/70">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-muted/55">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={`${key}-h-${index}`} className="border-b border-border/70 px-4 py-3 font-semibold">
                                {parseInline(header)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                    {rows.map((row, rowIndex) => (
                        <tr key={`${key}-r-${rowIndex}`} className="align-top">
                            {headers.map((_, cellIndex) => (
                                <td key={`${key}-c-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-muted-foreground">
                                    {parseInline(row[cellIndex] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function renderList(lines: string[], ordered: boolean, key: string): ReactNode {
    const Tag = ordered ? 'ol' : 'ul';
    return (
        <Tag
            key={key}
            className={cn(
                'my-3 space-y-1.5 pl-6 text-sm leading-7 marker:text-muted-foreground',
                ordered ? 'list-decimal' : 'list-disc',
            )}
        >
            {lines.map((line, index) => {
                const stripped = ordered
                    ? line.replace(/^\s*\d+[.)]\s+/, '')
                    : line.replace(/^\s*[-*+]\s+/, '');
                const task = stripped.match(/^\[( |x|X)\]\s+(.*)$/);
                return (
                    <li key={`${key}-${index}`} className={task ? 'list-none' : undefined}>
                        {task ? (
                            <span className="inline-flex items-start gap-2">
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'mt-1 grid size-4 place-items-center rounded border text-[10px]',
                                        task[1].toLowerCase() === 'x'
                                            ? 'border-brand-primary bg-brand-primary text-white'
                                            : 'border-border bg-background',
                                    )}
                                >
                                    {task[1].toLowerCase() === 'x' ? '✓' : ''}
                                </span>
                                <span>{parseInline(task[2])}</span>
                            </span>
                        ) : (
                            parseInline(stripped)
                        )}
                    </li>
                );
            })}
        </Tag>
    );
}

function renderBlocks(content: string): ReactNode[] {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const blocks: ReactNode[] = [];
    let index = 0;

    while (index < lines.length) {
        const line = lines[index];

        if (line.trim() === '') {
            index++;
            continue;
        }

        const fence = line.match(/^```\s*([^\s]*)\s*$/);
        if (fence) {
            const body: string[] = [];
            index++;
            while (index < lines.length && !/^```\s*$/.test(lines[index])) {
                body.push(lines[index]);
                index++;
            }
            if (index < lines.length) index++;
            blocks.push(
                <Fragment key={`fence-${index}`}>
                    {renderCodeBlock(body.join('\n'), fence[1] ?? '')}
                </Fragment>,
            );
            continue;
        }

        const heading = line.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
            const level = heading[1].length;
            const classes = level === 1
                ? 'mt-7 mb-3 text-2xl font-semibold tracking-tight'
                : level === 2
                  ? 'mt-6 mb-2 text-xl font-semibold tracking-tight'
                  : 'mt-5 mb-2 text-base font-semibold';
            const Tag = (`h${level}` as 'h1' | 'h2' | 'h3');
            blocks.push(<Tag key={`heading-${index}`} className={classes}>{parseInline(heading[2])}</Tag>);
            index++;
            continue;
        }

        if (line.trimStart().startsWith('>')) {
            const quoted: string[] = [];
            const start = index;
            while (index < lines.length && lines[index].trimStart().startsWith('>')) {
                quoted.push(lines[index].trimStart().replace(/^>\s?/, ''));
                index++;
            }
            blocks.push(
                <blockquote
                    key={`blockquote-${start}`}
                    className="my-4 border-l-2 border-brand-primary/40 pl-4 text-sm italic leading-7 text-muted-foreground"
                >
                    {quoted.map((value, quoteIndex) => (
                        <Fragment key={`${start}-${quoteIndex}`}>
                            {quoteIndex > 0 ? <br /> : null}
                            {parseInline(value)}
                        </Fragment>
                    ))}
                </blockquote>,
            );
            continue;
        }

        if (line.includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
            const tableLines = [line, lines[index + 1]];
            const start = index;
            index += 2;
            while (index < lines.length && lines[index].includes('|') && lines[index].trim() !== '') {
                tableLines.push(lines[index]);
                index++;
            }
            blocks.push(renderTable(tableLines, `table-${start}`));
            continue;
        }

        if (/^\s*[-*+]\s+/.test(line)) {
            const list: string[] = [];
            const start = index;
            while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
                list.push(lines[index]);
                index++;
            }
            blocks.push(renderList(list, false, `ul-${start}`));
            continue;
        }

        if (/^\s*\d+[.)]\s+/.test(line)) {
            const list: string[] = [];
            const start = index;
            while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
                list.push(lines[index]);
                index++;
            }
            blocks.push(renderList(list, true, `ol-${start}`));
            continue;
        }

        if (/^---+$/.test(line.trim())) {
            blocks.push(<hr key={`hr-${index}`} className="my-6 border-border/70" />);
            index++;
            continue;
        }

        const paragraph: string[] = [line];
        const start = index;
        index++;
        while (
            index < lines.length &&
            lines[index].trim() !== '' &&
            !/^(#{1,3})\s+/.test(lines[index]) &&
            !/^```/.test(lines[index]) &&
            !lines[index].trimStart().startsWith('>') &&
            !/^\s*[-*+]\s+/.test(lines[index]) &&
            !/^\s*\d+[.)]\s+/.test(lines[index]) &&
            !(lines[index].includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1]))
        ) {
            paragraph.push(lines[index]);
            index++;
        }
        blocks.push(
            <p key={`p-${start}`} className="my-2 text-sm leading-7 text-foreground/95">
                {paragraph.map((value, paragraphIndex) => (
                    <Fragment key={`${start}-${paragraphIndex}`}>
                        {paragraphIndex > 0 ? ' ' : null}
                        {parseInline(value)}
                    </Fragment>
                ))}
            </p>,
        );
    }

    return blocks;
}

export function RichMarkdown({ content, className }: Props) {
    const blocks = useMemo(() => renderBlocks(content), [content]);

    return <div className={cn('min-w-0 text-foreground', className)}>{blocks}</div>;
}
