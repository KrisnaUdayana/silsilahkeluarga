import { Request, Response } from 'express';
export declare const getAllPersons: (req: Request, res: Response) => Promise<void>;
export declare const getPersonById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createPerson: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePerson: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePerson: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFamilyTree: (req: Request, res: Response) => Promise<void>;
export declare const getChildren: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSiblings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const searchPersons: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=person.controller.d.ts.map