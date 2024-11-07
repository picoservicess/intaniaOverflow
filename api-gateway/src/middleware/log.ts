// middleware/logging.ts
import { NextFunction, Request, Response } from "express";

import { publishLog } from "../utils/log";

export const createLogMiddleware = (serviceName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
      const log = {
        statusCode: res.statusCode,
        datetime: new Date().toISOString(),
        endpoint: req.originalUrl,
        message: `${req.method} ${req.originalUrl}`,
        serviceName,
      };
      publishLog(log);
    });
    next();
  };
};
