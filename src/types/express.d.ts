import "express";

declare module "express-serve-static-core" {
  interface Request {
    context?: {
      userId: string | null;
      isTasty: boolean;
      role: string | null;
      email: string | null;
      phone: string | null;
      name: string | null;
      userImg: string | null;
    };
  }
}
