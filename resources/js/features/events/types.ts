export type AcademyEvent = {
    id: number;
    title: string;
    description: string;
    startsAt: string;
    endsAt: string;
    timezone: string;
    location: string | null;
    hasMeeting: boolean;
    meetingUrl: string | null;
    capacity: number | null;
    registrationsCount: number;
    spotsRemaining: number | null;
    isFull: boolean;
    isRegistered: boolean;
    canManage: boolean;
    reminderMinutes: number;
    creator: {
        id: number;
        name: string;
        avatar: string | null;
    };
};

export type EventsPageProps = {
    events: AcademyEvent[];
    canCreate: boolean;
};
