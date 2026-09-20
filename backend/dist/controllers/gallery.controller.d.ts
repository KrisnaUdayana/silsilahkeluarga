import { Request, Response } from 'express';
import multer from 'multer';
export declare const galleryUpload: multer.Multer;
export declare const getGalleryYears: (req: Request, res: Response) => Promise<void>;
export declare const createGalleryYear: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateGalleryYear: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteGalleryYear: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createGalleryEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateGalleryEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteGalleryEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createGalleryMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateGalleryMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const uploadGalleryMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteGalleryMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=gallery.controller.d.ts.map