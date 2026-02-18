import { Expose } from 'class-transformer';

export class UserProfileResponse {
    constructor(private readonly partial?: Partial<UserProfileResponse>) {
        Object.assign(this, partial);
    }

    @Expose()
    userId: string;

    @Expose()
    email: string;
}
