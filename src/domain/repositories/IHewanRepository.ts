import { Hewan, APIResponse, HewanMutationPayload } from "../entities/Hewan";

export interface IHewanRepository {
  getAll(): Promise<APIResponse<Hewan[]>>;
  getById(id: number): Promise<APIResponse<Hewan>>;
  create(hewan: HewanMutationPayload): Promise<APIResponse<Hewan>>;
  update(id: number, hewan: Partial<HewanMutationPayload>): Promise<APIResponse<Hewan>>;
  delete(id: number): Promise<APIResponse<{ message: string }>>;
}
