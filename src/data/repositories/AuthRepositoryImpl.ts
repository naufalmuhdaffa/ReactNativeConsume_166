import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { LoginResponse, RegisterResponse } from "../../domain/entities/Auth";
import apiClient from "../api/apiClient";

export class AuthRepositoryImpl implements IAuthRepository {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>("/auth/login", {
            email,
            password,
        });
        return response.data;
        }

        async register(username: string, email: string, password: string): Promise<RegisterResponse> {
        const response = await apiClient.post<RegisterResponse>("/auth/register", {
            username,
            email,
            password,
        });
        return response.data;
    }
}
