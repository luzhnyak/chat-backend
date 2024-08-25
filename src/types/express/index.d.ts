// import { IUser } from "../../models/user";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: {
//       id: string;
//     };
//   }
// }

// import { Request } from "express";

// export interface AuthenticatedRequest extends Request {
//   user?: { id: number; name: string; email: string };
// }

import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { _id: string; name?: string; email?: string };
}
