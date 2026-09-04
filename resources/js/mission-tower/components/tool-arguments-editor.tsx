import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type SchemaProperty = {
    type?: string;
    enum?: Array<string | number>;
    format?: string;
    description?: string;
    default?: unknown;
};

type Schema = {
    properties?: Record<string, SchemaProperty>;
    required?: string[];
};

export function ToolArgumentsEditor({
    schema,
    value,
    onChange,
}: {
    schema: Schema;
    value: Record<string, string | number | boolean | null>;
    onChange: (value: Record<string, string | number | boolean | null>) => void;
}) {
    const required = new Set(schema.required ?? []);
    const properties = Object.entries(schema.properties ?? {});

    if (properties.length === 0) {
        return (
            <p className="text-xs leading-5 text-muted-foreground">
                Ce tool n'attend aucun argument.
            </p>
        );
    }

    const setField = (
        key: string,
        next: string | number | boolean | null | undefined,
    ) => {
        const copy = { ...value };

        if (next === '' || next === undefined) {
            delete copy[key];
        } else {
            copy[key] = next;
        }

        onChange(copy);
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {properties.map(([key, property]) => {
                const id = `tower-arg-${key}`;
                const label = `${key}${required.has(key) ? ' *' : ''}`;
                const current = value[key];

                if (property.type === 'boolean') {
                    return (
                        <div key={key} className="flex items-center gap-3 pt-7">
                            <Checkbox
                                id={id}
                                checked={current === true}
                                onCheckedChange={(checked) =>
                                    setField(key, checked === true)
                                }
                            />
                            <Label htmlFor={id}>{label}</Label>
                        </div>
                    );
                }

                if (property.enum && property.enum.length > 0) {
                    return (
                        <div key={key} className="space-y-2">
                            <Label htmlFor={id}>{label}</Label>
                            <Select
                                value={
                                    current === undefined
                                        ? undefined
                                        : String(current)
                                }
                                onValueChange={(next) => setField(key, next)}
                            >
                                <SelectTrigger id={id}>
                                    <SelectValue placeholder="Choisir" />
                                </SelectTrigger>
                                <SelectContent>
                                    {property.enum.map((option) => (
                                        <SelectItem
                                            key={String(option)}
                                            value={String(option)}
                                        >
                                            {String(option)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    );
                }

                if (property.type === 'integer' || property.type === 'number') {
                    return (
                        <div key={key} className="space-y-2">
                            <Label htmlFor={id}>{label}</Label>
                            <Input
                                id={id}
                                type="number"
                                value={
                                    current === undefined ? '' : String(current)
                                }
                                onChange={(event) => {
                                    const raw = event.target.value;
                                    setField(
                                        key,
                                        raw === ''
                                            ? ''
                                            : property.type === 'integer'
                                              ? Number.parseInt(raw, 10)
                                              : Number.parseFloat(raw),
                                    );
                                }}
                            />
                        </div>
                    );
                }

                if (
                    key.includes('description') ||
                    key.includes('content') ||
                    key === 'prompt'
                ) {
                    return (
                        <div key={key} className="space-y-2 sm:col-span-2">
                            <Label htmlFor={id}>{label}</Label>
                            <Textarea
                                id={id}
                                rows={4}
                                value={
                                    current === undefined ? '' : String(current)
                                }
                                onChange={(event) =>
                                    setField(key, event.target.value)
                                }
                            />
                        </div>
                    );
                }

                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={id}>{label}</Label>
                        <Input
                            id={id}
                            type={
                                property.format === 'date-time'
                                    ? 'datetime-local'
                                    : 'text'
                            }
                            value={current === undefined ? '' : String(current)}
                            onChange={(event) =>
                                setField(key, event.target.value)
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
}
