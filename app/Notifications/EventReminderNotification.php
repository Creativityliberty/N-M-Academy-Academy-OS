<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\AcademyEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly AcademyEvent $event) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $startsAt = $this->event->starts_at
            ->copy()
            ->timezone($this->event->timezone)
            ->locale('fr')
            ->translatedFormat('l j F Y à H:i');

        $message = (new MailMessage)
            ->subject('Rappel : '.$this->event->title)
            ->greeting('Bonjour '.$notifiable->name.',')
            ->line('Votre événement approche : '.$this->event->title.'.')
            ->line('Début prévu '.$startsAt.' ('.$this->event->timezone.').');

        if ($this->event->location) {
            $message->line('Lieu : '.$this->event->location.'.');
        }

        return $message
            ->action('Voir mon événement', route('community.events'))
            ->line('Le lien du live est disponible dans votre espace si vous êtes inscrit.');
    }
}
