import { useState } from 'react';
import { Form, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import PlanController from '@/actions/App/Http/Controllers/Admin/Plans/PlanController';

type Option = { value: string; label: string };

type PageProps = {
    currencies: Option[];
    intervals: Option[];
};

export default function PlanCreate() {
    const { currencies, intervals } = usePage<PageProps>().props;

    const [currency, setCurrency]   = useState(currencies[0]?.value ?? 'eur');
    const [interval, setInterval]   = useState(intervals[0]?.value ?? 'month');
    const [highlight, setHighlight] = useState(false);
    const [isActive, setIsActive]   = useState(true);
    const [features, setFeatures]   = useState<string[]>(['']);

    return (
        <>
            <Head title="Créer un plan" />

            <div className="container mx-auto space-y-6 p-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Créer un plan</h1>
                    <p className="text-muted-foreground">
                        Le produit et le prix seront créés automatiquement sur Stripe.
                    </p>
                </div>

                <Separator />

                <Form {...PlanController.store.form()} className="space-y-8">
                    {({ processing, errors, clearErrors }) => (
                        <>
                            <input type="hidden" name="currency" value={currency} />
                            <input type="hidden" name="interval" value={interval} />
                            <input type="hidden" name="highlight" value={highlight ? '1' : '0'} />
                            <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
                            {features.map((f, i) => (
                                <input key={i} type="hidden" name={`features[${i}]`} value={f} />
                            ))}

                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">Informations du plan</h2>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            autoFocus
                                            placeholder="Ex : Pro"
                                            onChange={() => clearErrors('name')}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">Prix (€) *</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min={1}
                                            step={0.01}
                                            placeholder="69"
                                            onChange={() => clearErrors('price')}
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Devise *</Label>
                                        <Select value={currency} onValueChange={setCurrency}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((c) => (
                                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Intervalle *</Label>
                                        <Select value={interval} onValueChange={setInterval}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {intervals.map((i) => (
                                                    <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="highlight"
                                            checked={highlight}
                                            onCheckedChange={(v) => setHighlight(!!v)}
                                            className="size-5"
                                        />
                                        <Label htmlFor="highlight" className="cursor-pointer font-normal">
                                            Mettre en avant (populaire)
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="is_active"
                                            checked={isActive}
                                            onCheckedChange={(v) => setIsActive(!!v)}
                                            className="size-5"
                                        />
                                        <Label htmlFor="is_active" className="cursor-pointer font-normal">
                                            Actif (visible sur le site)
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-semibold">Fonctionnalités</h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFeatures((p) => [...p, ''])}
                                    >
                                        <PlusIcon className="mr-1 size-4" />
                                        Ajouter
                                    </Button>
                                </div>

                                <InputError message={errors.features} />

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {features.map((f, i) => (
                                        <div key={i} className="flex min-w-0 gap-2">
                                            <Input
                                                value={f}
                                                className="min-w-0 flex-1"
                                                placeholder={`Ex : Cours illimités`}
                                                onChange={(e) => setFeatures((p) => p.map((v, j) => j === i ? e.target.value : v))}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={() => setFeatures((p) => p.filter((_, j) => j !== i))}
                                            >
                                                <Trash2Icon className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner className="mr-2" />}
                                    Créer le plan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

PlanCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Plans', href: admin.plans.index() },
        { title: 'Nouveau plan', href: admin.plans.create() },
    ],
};
