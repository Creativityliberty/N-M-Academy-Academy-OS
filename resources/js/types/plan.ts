export type Plan = {
    id: number;
    name: string;
    slug: string;
    stripe_product_id: string | null;
    stripe_price_id: string | null;
    price: number;
    formatted_price: string;
    currency: string;
    currency_label: string;
    interval: string;
    interval_label: string;
    features: string[];
    highlight: boolean;
    is_active: boolean;
    order: number;
};
