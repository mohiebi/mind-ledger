import { Expose } from 'class-transformer';

export class AuthResponse {
    constructor(private readonly partial?: Partial<AuthResponse>) {
        Object.assign(this, partial);
    }

    @Expose()
    accessToken: string;
}
