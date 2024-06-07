
export interface Member {
    id: number;
    username: string;
    photoUrl: string | null;
    age: number;
    knownAs: string | null;
    created: Date;
    lastActive: Date;
    gender: string | null;
    introduction: string | null;
    lookingFor: string | null;
    interests: string | null;
    city: string | null;
    country: string | null;
    photos: Photo[] | null;
}

export interface Photo {
    id: number;
    url: string | null;
    isMain: boolean;
}