import type { HewanStatus } from '../domain/entities/Hewan';

export const DEFAULT_HEWAN_STATUS: HewanStatus = 'tersedia';

export const HEWAN_STATUS_OPTIONS: Array<{
  label: string;
  value: HewanStatus;
}> = [
  { label: 'Tersedia', value: 'tersedia' },
  { label: 'Terjual', value: 'terjual' },
];

export const getHewanStatusLabel = (status?: HewanStatus) => {
  return HEWAN_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? 'Belum ada status';
};
