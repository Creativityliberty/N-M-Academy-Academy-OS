import { Badge } from '@/components/ui/badge';

const labels: Record<string, string> = {
    draft: 'Brouillon',
    pending: 'En attente',
    queued: 'En file',
    running: 'En cours',
    awaiting_approval: 'Validation',
    processing: 'Traitement',
    approved: 'Approuvé',
    rejected: 'Refusé',
    cancelled: 'Annulé',
    succeeded: 'Réussi',
    completed: 'Terminé',
    failed: 'Échec',
    expired: 'Expiré',
    recorded: 'Enregistré',
    warning: 'Attention',
    critical: 'Critique',
    info: 'Info',
    open: 'Ouvert',
    resolved: 'Résolu',
    mission_created: 'Mission créée',
    partial: 'Partiel',
    compiling: 'Compilation',
    proposal: 'Proposition',
    applied: 'Appliquée',
};

export function TowerStatusBadge({ status }: { status: string }) {
    const destructive = ['failed', 'rejected', 'expired', 'critical'].includes(
        status,
    );
    const active = [
        'running',
        'awaiting_approval',
        'processing',
        'pending',
        'warning',
    ].includes(status);

    return (
        <Badge
            variant={
                destructive ? 'destructive' : active ? 'secondary' : 'outline'
            }
            className="whitespace-nowrap"
        >
            {labels[status] ?? status}
        </Badge>
    );
}
