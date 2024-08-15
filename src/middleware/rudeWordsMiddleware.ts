import { Request, Response, NextFunction } from "express";

const rudeWords = ["badword1", "badword2"];

const filterRudeWords = (text: string) => {
  let filteredText = text;
  rudeWords.forEach((word) => {
    const regex = new RegExp(word, "gi");
    filteredText = filteredText.replace(regex, "***");
  });
  return filteredText;
};

const rudeWordsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.description) {
    req.body.description = filterRudeWords(req.body.description);
  }
  if (req.body.note) {
    req.body.note = filterRudeWords(req.body.note);
  }
  next();
};

export default rudeWordsMiddleware;
