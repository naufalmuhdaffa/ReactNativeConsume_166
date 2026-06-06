export type HewanStatus = 'tersedia' | 'terjual';

export interface Hewan {
    id?: number;
    nama: string;
    jenis: string;
    tanggal_lahir?: string;
    harga: number;
    status?: HewanStatus;
    createdAt?: string;
    updatedAt?: string;
}

export type HewanMutationPayload = {
    nama: string;
    jenis: string;
    tanggal_lahir: string;
    harga: number;
    status: HewanStatus;
};

export interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
