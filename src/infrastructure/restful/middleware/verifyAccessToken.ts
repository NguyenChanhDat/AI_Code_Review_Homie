import { Request, Response, NextFunction } from 'express';

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const personalAccessToken = req.header('x-azure-personalAccessToken');
  try {
    if (!personalAccessToken) {
      return res
        .status(400)
        .json({ message: 'missing personal access token header' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: 'missing personal access token header' });
  }
}
