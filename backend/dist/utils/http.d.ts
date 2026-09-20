import { Request, Response } from 'express';
export declare const validationError: (res: Response, error: string) => Response<any, Record<string, any>>;
export declare const conflictError: (res: Response, error: string) => Response<any, Record<string, any>>;
export declare const parseOptionalDate: (value: unknown, fieldName: string) => {
    ok: false;
    error: string;
    value?: undefined;
} | {
    ok: true;
    value: Date;
    error?: undefined;
};
export declare const getJwtSecret: () => string;
export declare const getAllowedOrigins: () => string[];
export declare const methodNotAllowed: (req: Request, res: Response) => Response<any, Record<string, any>>;
//# sourceMappingURL=http.d.ts.map