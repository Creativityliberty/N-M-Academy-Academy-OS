import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    CircleDashed,
    ExternalLink,
    Factory,
    RefreshCw,
    Rocket,
    ShieldCheck,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo } from 'react';
import { DashboardHero } from '@/components/dashboard-hero';
import { DashboardSection } from '@/components/dashboard-section';

type Template = {
    key: string;
    label: string;
    descriptor: string;
    theme: Record<string, string>;
    capability_profile: string;
};

type CapabilityProfile = {
    key: string;
    label: string;
    description: string;
    features: Record<string, boolean>;
};

type Deployment = {
    id: number;
    receiptId: string;
    clientName: string;
    templateKey: string;
    domain: string;
    status: string;
    phase: string;
    steps: Record<
        string,
        { status: string; message?: string | null; at: string }
    >;
    applicationUuid?: string | null;
    deploymentUuid?: string | null;
    lastError?: string | null;
    completedAt?: string | null;
    liveUrl: string;
};

type Props = {
    templates: Template[];
    capabilityProfiles: CapabilityProfile[];
    deployments: Deployment[];
    source: {
        mode: string;
        repository?: string | null;
        branch?: string | null;
        serverConfigured: boolean;
    };
};

const platformFeatureLabels: Record<string, string> = {
    community: 'Community',
    events: 'Events',
    ai: 'Academy AI',
    tutor: 'AI Tutor',
    sales: 'Sales',
    pages: 'Page Builder',
    mcp: 'MCP Gateway',
    tower: 'Mission Tower',
};

const learningFeatureLabels: Record<string, string> = {
    assessments: 'Quiz & assessments',
    assignments: 'Assignments & projects',
    completion: 'Completion rules',
    certificates: 'Certificates',
    drip: 'Drip & prérequis',
};

export default function AcademyFactoryIndex() {
    const { templates, capabilityProfiles, deployments, source } = usePage<Props>().props;
    const defaultTemplate = templates[0];
    const defaultCapabilityProfile =
        capabilityProfiles.find((profile) => profile.key === defaultTemplate?.capability_profile) ?? capabilityProfiles[0];
    const form = useForm({
        client_name: '',
        short_name: '',
        descriptor: defaultTemplate?.descriptor ?? '',
        domain: '',
        template_key: defaultTemplate?.key ?? 'creator',
        capability_profile: defaultCapabilityProfile?.key ?? 'creator',
        logo_url: '',
        theme: {
            primary: defaultTemplate?.theme.primary ?? '#6F7F70',
            secondary: defaultTemplate?.theme.secondary ?? '#202720',
            accent: defaultTemplate?.theme.accent ?? '#B79B72',
        },
        features: defaultCapabilityProfile?.features ?? {},
        learning: {
            require_all_accessible_lessons: true,
            issuer_name: '',
            certificate_title: 'Certificat de réussite',
            public_verification: true,
            pdf_download: true,
            student_sharing: true,
        },
        owner: { name: '', email: '', password: '' },
        ai: {
            provider: 'disabled',
            model: '',
            openai_api_key: '',
            deepseek_api_key: '',
            image_provider: 'gemini',
            image_model: 'gemini-3.1-flash-lite-image',
            image_size: '1K',
            image_prompt_preset: 'academy-premium',
            gemini_api_key: '',
            embedding_provider: 'disabled',
        },
        stripe: {
            key: '',
            secret: '',
            webhook_secret: '',
            client_id: '',
            platform_fee_bps: 0,
            affiliate_bps: 1000,
            currency: 'EUR',
        },
        mail: {
            mailer: 'smtp',
            host: '',
            port: 587,
            username: '',
            password: '',
            from_address: '',
            from_name: '',
        },
    });

    const selectedTemplate = useMemo(
        () =>
            templates.find(
                (template) => template.key === form.data.template_key,
            ) ?? defaultTemplate,
        [templates, form.data.template_key, defaultTemplate],
    );

    const selectedCapabilityProfile = useMemo(
        () =>
            capabilityProfiles.find(
                (profile) => profile.key === form.data.capability_profile,
            ) ?? defaultCapabilityProfile,
        [capabilityProfiles, form.data.capability_profile, defaultCapabilityProfile],
    );

    useEffect(() => {
        if (!selectedTemplate) {
            return;
        }

        form.setData((data) => ({
            ...data,
            descriptor: data.descriptor || selectedTemplate.descriptor,
            capability_profile: selectedTemplate.capability_profile,
            theme: {
                primary: selectedTemplate.theme.primary,
                secondary: selectedTemplate.theme.secondary,
                accent: selectedTemplate.theme.accent,
            },
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTemplate?.key]);

    useEffect(() => {
        if (!selectedCapabilityProfile) {
            return;
        }

        form.setData('features', selectedCapabilityProfile.features);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCapabilityProfile?.key]);

    const toggleFeature = (key: string, checked: boolean) => {
        const next = { ...form.data.features, [key]: checked };

        if (key === 'certificates' && checked) next.completion = true;
        if (key === 'completion' && !checked) next.certificates = false;
        if (key === 'tower' && checked) next.mcp = true;
        if (key === 'mcp' && !checked) next.tower = false;
        if (key === 'ai' && !checked) next.tutor = false;

        form.setData('features', next);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/factory', {
            preserveScroll: true,
            onSuccess: () => form.reset('owner', 'ai', 'stripe', 'mail'),
        });
    };

    return (
        <>
            <Head title="Academy Factory" />
            <div className="mx-auto w-full max-w-[1580px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                <DashboardHero
                    title="Academy Factory"
                    description="Transformez le master NÜM Academy OS en instances client isolées, brandées et déployées automatiquement sur Coolify."
                />

                <DashboardSection
                    title="Nouvelle Academy"
                    description="Le blueprint ne contient pas les secrets en clair. Les credentials sont chiffrés jusqu’à leur injection dans Coolify."
                >
                    <form
                        onSubmit={submit}
                        className="grid gap-6 xl:grid-cols-[1.15fr_1fr]"
                    >
                        <div className="space-y-5 rounded-2xl border bg-card p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Client / Academy"
                                    value={form.data.client_name}
                                    onChange={(value) =>
                                        form.setData('client_name', value)
                                    }
                                    error={form.errors.client_name}
                                    required
                                />
                                <Field
                                    label="Domaine"
                                    value={form.data.domain}
                                    onChange={(value) =>
                                        form.setData('domain', value)
                                    }
                                    placeholder="academy.client.com"
                                    error={form.errors.domain}
                                    required
                                />
                                <Field
                                    label="Nom court"
                                    value={form.data.short_name}
                                    onChange={(value) =>
                                        form.setData('short_name', value)
                                    }
                                    placeholder="ACME"
                                />
                                <Field
                                    label="Logo URL"
                                    value={form.data.logo_url}
                                    onChange={(value) =>
                                        form.setData('logo_url', value)
                                    }
                                    placeholder="https://…"
                                />
                            </div>
                            <label className="block space-y-2 text-sm font-medium">
                                <span>Template</span>
                                <select
                                    value={form.data.template_key}
                                    onChange={(event) =>
                                        form.setData(
                                            'template_key',
                                            event.target.value,
                                        )
                                    }
                                    className="h-10 w-full rounded-xl border bg-background px-3"
                                >
                                    {templates.map((template) => (
                                        <option
                                            key={template.key}
                                            value={template.key}
                                        >
                                            {template.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <Field
                                label="Descriptor"
                                value={form.data.descriptor}
                                onChange={(value) =>
                                    form.setData('descriptor', value)
                                }
                            />
                            <div className="grid gap-3 sm:grid-cols-3">
                                <ColorField
                                    label="Primary"
                                    value={form.data.theme.primary}
                                    onChange={(value) =>
                                        form.setData('theme', {
                                            ...form.data.theme,
                                            primary: value,
                                        })
                                    }
                                />
                                <ColorField
                                    label="Secondary"
                                    value={form.data.theme.secondary}
                                    onChange={(value) =>
                                        form.setData('theme', {
                                            ...form.data.theme,
                                            secondary: value,
                                        })
                                    }
                                />
                                <ColorField
                                    label="Accent"
                                    value={form.data.theme.accent}
                                    onChange={(value) =>
                                        form.setData('theme', {
                                            ...form.data.theme,
                                            accent: value,
                                        })
                                    }
                                />
                            </div>
                            <label className="block space-y-2 text-sm font-medium">
                                <span>Capability profile</span>
                                <select
                                    value={form.data.capability_profile}
                                    onChange={(event) =>
                                        form.setData('capability_profile', event.target.value)
                                    }
                                    className="h-10 w-full rounded-xl border bg-background px-3"
                                >
                                    {capabilityProfiles.map((profile) => (
                                        <option key={profile.key} value={profile.key}>
                                            {profile.label}
                                        </option>
                                    ))}
                                </select>
                                {selectedCapabilityProfile && (
                                    <span className="block text-xs font-normal text-muted-foreground">
                                        {selectedCapabilityProfile.description}
                                    </span>
                                )}
                            </label>
                            <div>
                                <div className="mb-2 text-sm font-medium">Platform capabilities</div>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(platformFeatureLabels).map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(form.data.features[key])}
                                                onChange={(event) => toggleFeature(key, event.target.checked)}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 rounded-2xl border border-brand-primary/15 bg-brand-primary/5 p-4">
                                <div>
                                    <p className="text-sm font-semibold">Learning & Certification</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Les capacités pédagogiques sont séparées du template visuel et suivent chaque Academy provisionnée.</p>
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {Object.entries(learningFeatureLabels).map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(form.data.features[key])}
                                                onChange={(event) => toggleFeature(key, event.target.checked)}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Émetteur du certificat"
                                        value={form.data.learning.issuer_name}
                                        onChange={(value) =>
                                            form.setData('learning', { ...form.data.learning, issuer_name: value })
                                        }
                                        placeholder={form.data.client_name || 'Nom de l’Academy'}
                                    />
                                    <Field
                                        label="Titre du certificat"
                                        value={form.data.learning.certificate_title}
                                        onChange={(value) =>
                                            form.setData('learning', { ...form.data.learning, certificate_title: value })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <ToggleField
                                        label="Toutes les leçons accessibles requises"
                                        checked={form.data.learning.require_all_accessible_lessons}
                                        onChange={(checked) => form.setData('learning', { ...form.data.learning, require_all_accessible_lessons: checked })}
                                    />
                                    <ToggleField
                                        label="Vérification publique"
                                        checked={form.data.learning.public_verification}
                                        onChange={(checked) => form.setData('learning', { ...form.data.learning, public_verification: checked, student_sharing: checked ? form.data.learning.student_sharing : false })}
                                    />
                                    <ToggleField
                                        label="Téléchargement PDF étudiant"
                                        checked={form.data.learning.pdf_download}
                                        onChange={(checked) => form.setData('learning', { ...form.data.learning, pdf_download: checked })}
                                    />
                                    <ToggleField
                                        label="Partage étudiant"
                                        checked={form.data.learning.student_sharing}
                                        disabled={!form.data.learning.public_verification}
                                        onChange={(checked) => form.setData('learning', { ...form.data.learning, student_sharing: checked })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 rounded-2xl border bg-card p-5">
                            <h3 className="font-semibold">
                                Owner & integrations
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Owner name"
                                    value={form.data.owner.name}
                                    onChange={(value) =>
                                        form.setData('owner', {
                                            ...form.data.owner,
                                            name: value,
                                        })
                                    }
                                    required
                                />
                                <Field
                                    label="Owner email"
                                    type="email"
                                    value={form.data.owner.email}
                                    onChange={(value) =>
                                        form.setData('owner', {
                                            ...form.data.owner,
                                            email: value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <Field
                                label="Temporary owner password"
                                type="password"
                                value={form.data.owner.password}
                                onChange={(value) =>
                                    form.setData('owner', {
                                        ...form.data.owner,
                                        password: value,
                                    })
                                }
                                required
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block space-y-2 text-sm font-medium">
                                    <span>AI provider</span>
                                    <select
                                        value={form.data.ai.provider}
                                        onChange={(event) =>
                                            form.setData('ai', {
                                                ...form.data.ai,
                                                provider: event.target.value,
                                            })
                                        }
                                        className="h-10 w-full rounded-xl border bg-background px-3"
                                    >
                                        <option value="disabled">
                                            Disabled
                                        </option>
                                        <option value="openai">OpenAI</option>
                                        <option value="deepseek">
                                            DeepSeek
                                        </option>
                                    </select>
                                </label>
                                <label className="block space-y-2 text-sm font-medium">
                                    <span>Embeddings</span>
                                    <select
                                        value={form.data.ai.embedding_provider}
                                        onChange={(event) =>
                                            form.setData('ai', {
                                                ...form.data.ai,
                                                embedding_provider:
                                                    event.target.value,
                                            })
                                        }
                                        className="h-10 w-full rounded-xl border bg-background px-3"
                                    >
                                        <option value="disabled">
                                            Disabled / lexical
                                        </option>
                                        <option value="openai">OpenAI</option>
                                    </select>
                                </label>
                            </div>
                            {form.data.ai.provider === 'openai' && (
                                <Field
                                    label="OpenAI API key"
                                    type="password"
                                    value={form.data.ai.openai_api_key}
                                    onChange={(value) =>
                                        form.setData('ai', {
                                            ...form.data.ai,
                                            openai_api_key: value,
                                        })
                                    }
                                />
                            )}
                            {form.data.ai.provider === 'deepseek' && (
                                <Field
                                    label="DeepSeek API key"
                                    type="password"
                                    value={form.data.ai.deepseek_api_key}
                                    onChange={(value) =>
                                        form.setData('ai', {
                                            ...form.data.ai,
                                            deepseek_api_key: value,
                                        })
                                    }
                                />
                            )}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block space-y-2 text-sm font-medium">
                                    <span>Image provider</span>
                                    <select
                                        value={form.data.ai.image_provider}
                                        onChange={(event) =>
                                            form.setData('ai', {
                                                ...form.data.ai,
                                                image_provider: event.target.value,
                                            })
                                        }
                                        className="h-10 w-full rounded-xl border bg-background px-3"
                                    >
                                        <option value="gemini">Gemini / Nano Banana</option>
                                        <option value="openai">OpenAI</option>
                                        <option value="disabled">Disabled</option>
                                    </select>
                                </label>
                                <label className="block space-y-2 text-sm font-medium">
                                    <span>Gemini image model</span>
                                    <select
                                        value={form.data.ai.image_model}
                                        onChange={(event) =>
                                            form.setData('ai', {
                                                ...form.data.ai,
                                                image_model: event.target.value,
                                                image_size:
                                                    event.target.value === 'gemini-3.1-flash-lite-image'
                                                        ? '1K'
                                                        : form.data.ai.image_size,
                                            })
                                        }
                                        disabled={form.data.ai.image_provider !== 'gemini'}
                                        className="h-10 w-full rounded-xl border bg-background px-3 disabled:opacity-60"
                                    >
                                        <option value="gemini-3.1-flash-lite-image">Nano Banana 2 Lite</option>
                                        <option value="gemini-3.1-flash-image">Nano Banana 2</option>
                                        <option value="gemini-3-pro-image">Nano Banana Pro</option>
                                    </select>
                                </label>
                            </div>
                            {form.data.ai.image_provider === 'gemini' && (
                                <Field
                                    label="Gemini API key"
                                    type="password"
                                    value={form.data.ai.gemini_api_key}
                                    onChange={(value) =>
                                        form.setData('ai', {
                                            ...form.data.ai,
                                            gemini_api_key: value,
                                        })
                                    }
                                />
                            )}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block space-y-2 text-sm font-medium">
                                    <span>Image quality</span>
                                    <select
                                        value={form.data.ai.image_size}
                                        onChange={(event) =>
                                            form.setData('ai', {
                                                ...form.data.ai,
                                                image_size: event.target.value,
                                            })
                                        }
                                        disabled={form.data.ai.image_model === 'gemini-3.1-flash-lite-image'}
                                        className="h-10 w-full rounded-xl border bg-background px-3 disabled:opacity-60"
                                    >
                                        <option value="1K">1K</option>
                                        <option value="2K">2K</option>
                                        <option value="4K">4K</option>
                                    </select>
                                </label>
                                <label className="block space-y-2 text-sm font-medium">
                                    <span>Visual prompt preset</span>
                                    <select
                                        value={form.data.ai.image_prompt_preset}
                                        onChange={(event) =>
                                            form.setData('ai', {
                                                ...form.data.ai,
                                                image_prompt_preset: event.target.value,
                                            })
                                        }
                                        className="h-10 w-full rounded-xl border bg-background px-3"
                                    >
                                        <option value="academy-premium">Academy Premium</option>
                                        <option value="editorial">Editorial</option>
                                        <option value="cinematic">Cinematic</option>
                                        <option value="minimal">Minimal</option>
                                    </select>
                                </label>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Stripe publishable key"
                                    value={form.data.stripe.key}
                                    onChange={(value) =>
                                        form.setData('stripe', {
                                            ...form.data.stripe,
                                            key: value,
                                        })
                                    }
                                />
                                <Field
                                    label="Stripe secret"
                                    type="password"
                                    value={form.data.stripe.secret}
                                    onChange={(value) =>
                                        form.setData('stripe', {
                                            ...form.data.stripe,
                                            secret: value,
                                        })
                                    }
                                />
                            </div>
                            <Field
                                label="Stripe webhook secret"
                                type="password"
                                value={form.data.stripe.webhook_secret}
                                onChange={(value) =>
                                    form.setData('stripe', {
                                        ...form.data.stripe,
                                        webhook_secret: value,
                                    })
                                }
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="SMTP host"
                                    value={form.data.mail.host}
                                    onChange={(value) =>
                                        form.setData('mail', {
                                            ...form.data.mail,
                                            host: value,
                                        })
                                    }
                                />
                                <Field
                                    label="SMTP username"
                                    value={form.data.mail.username}
                                    onChange={(value) =>
                                        form.setData('mail', {
                                            ...form.data.mail,
                                            username: value,
                                        })
                                    }
                                />
                            </div>
                            <Field
                                label="SMTP password"
                                type="password"
                                value={form.data.mail.password}
                                onChange={(value) =>
                                    form.setData('mail', {
                                        ...form.data.mail,
                                        password: value,
                                    })
                                }
                            />
                            <button
                                disabled={
                                    form.processing || !source.serverConfigured
                                }
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-medium text-primary-foreground disabled:opacity-50"
                            >
                                <ShieldCheck className="size-4" /> Générer le
                                blueprint
                            </button>
                            {!source.serverConfigured && (
                                <p className="text-sm text-destructive">
                                    Configurez COOLIFY_SERVER_UUID sur cette
                                    Factory avant de provisionner.
                                </p>
                            )}
                        </div>
                    </form>
                </DashboardSection>

                <DashboardSection
                    title="Provisioning"
                    description={`${source.mode} · ${source.repository ?? 'repository non configuré'} · ${source.branch ?? 'main'}`}
                >
                    <div className="space-y-4">
                        {deployments.length === 0 && (
                            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                                Aucun blueprint pour le moment.
                            </div>
                        )}
                        {deployments.map((deployment) => (
                            <div
                                key={deployment.id}
                                className="rounded-2xl border bg-card p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Factory className="size-4 text-primary" />
                                            <h3 className="font-semibold">
                                                {deployment.clientName}
                                            </h3>
                                            <Status
                                                status={deployment.status}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {deployment.domain} ·{' '}
                                            {deployment.templateKey} · receipt{' '}
                                            {deployment.receiptId.slice(0, 8)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {deployment.status !== 'healthy' && (
                                            <button
                                                onClick={() =>
                                                    router.post(
                                                        `/admin/factory/${deployment.id}/provision`,
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium"
                                            >
                                                <Rocket className="size-4" />
                                                {deployment.status === 'draft'
                                                    ? 'Provisionner'
                                                    : 'Retry'}
                                            </button>
                                        )}
                                        {deployment.applicationUuid &&
                                            deployment.status !== 'healthy' && (
                                                <button
                                                    onClick={() =>
                                                        router.post(
                                                            `/admin/factory/${deployment.id}/verify`,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm"
                                                >
                                                    <RefreshCw className="size-4" />{' '}
                                                    Vérifier
                                                </button>
                                            )}
                                        {deployment.status === 'healthy' && (
                                            <a
                                                href={deployment.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
                                            >
                                                Ouvrir{' '}
                                                <ExternalLink className="size-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                    {Object.entries(deployment.steps).map(
                                        ([key, step]) => (
                                            <Step
                                                key={key}
                                                name={key}
                                                status={step.status}
                                                message={step.message}
                                            />
                                        ),
                                    )}
                                </div>
                                {deployment.lastError && (
                                    <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                        {deployment.lastError}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </DashboardSection>
            </div>
        </>
    );
}

function Field({
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    error,
    required = false,
}: {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
}) {
    return (
        <label className="block space-y-2 text-sm font-medium">
            <span>{label}</span>
            <input
                required={required}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="h-10 w-full rounded-xl border bg-background px-3"
            />
            {error && <span className="text-xs text-destructive">{error}</span>}
        </label>
    );
}

function ToggleField({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
    return (
        <label className="flex items-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-sm">
            <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
            <span className={disabled ? 'text-muted-foreground' : ''}>{label}</span>
        </label>
    );
}

function ColorField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="space-y-2 text-sm font-medium">
            <span>{label}</span>
            <div className="flex h-10 items-center gap-2 rounded-xl border px-2">
                <input
                    type="color"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="size-7 border-0 bg-transparent"
                />
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none"
                />
            </div>
        </label>
    );
}

function Status({ status }: { status: string }) {
    const healthy = status === 'healthy';

    return (
        <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${healthy ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
        >
            {status}
        </span>
    );
}

function Step({
    name,
    status,
    message,
}: {
    name: string;
    status: string;
    message?: string | null;
}) {
    const done = status === 'done';

    return (
        <div className="rounded-xl border p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
                {done ? (
                    <CheckCircle2 className="size-4 text-primary" />
                ) : (
                    <CircleDashed className="size-4 text-muted-foreground" />
                )}
                {name.replaceAll('_', ' ')}
            </div>
            {message && (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    );
}

AcademyFactoryIndex.layout = {
    breadcrumbs: [{ title: 'Academy Factory', href: '/admin/factory' }],
};
