export interface Hewan {
    id?: number;
    nama: string;
    jenis: string;
    tanggal_lahir?: string;
    harga: number;
    status?: 'tersedia' | 'terjual';
    createdAt?: string;
    updatedAt?: string;
}