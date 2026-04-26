export type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    cover?: string;
    role_ids?: number[];
    email_verified_at: string | null;
    last_login_at?: string | null;
    created_at: string;
    updated_at: string;
}