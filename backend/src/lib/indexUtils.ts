import {ApiResponse} from "../types";
import { config } from '../config';


export function showBackendError (error: unknown, errorMessage: string = 'Неизвестная ошибка при работе сервера') {
    console.error(errorMessage, error);
    const err: any = error;
    const devSuffix = (config.nodeEnv !== 'production' && (err?.message || err?.detail)) ? `: ${err.message || err.detail}` : '';
    const response: ApiResponse = {
        success: false,
        error: `${errorMessage} ${devSuffix}`
    };

    return response;
}