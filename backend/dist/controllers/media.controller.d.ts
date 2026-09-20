import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
export declare const uploadMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPersonMedia: (req: Request, res: Response) => Promise<void>;
export declare const deleteMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const uploadProfilePhoto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=media.controller.d.ts.map