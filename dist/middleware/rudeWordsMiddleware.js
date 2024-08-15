"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rudeWords = ["badword1", "badword2"]; // Add rude words to filter
const filterRudeWords = (text) => {
    let filteredText = text;
    rudeWords.forEach((word) => {
        const regex = new RegExp(word, "gi");
        filteredText = filteredText.replace(regex, "***");
    });
    return filteredText;
};
const rudeWordsMiddleware = (req, res, next) => {
    if (req.body.description) {
        req.body.description = filterRudeWords(req.body.description);
    }
    if (req.body.note) {
        req.body.note = filterRudeWords(req.body.note);
    }
    next();
};
exports.default = rudeWordsMiddleware;
