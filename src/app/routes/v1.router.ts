import {Request, Response, Router} from "express";
import {geInstance as autoCompleteServiceProvider, SUPPORTED_LANGUAGES} from "../services/auto-complete-service";
import {geInstance as metricServiceProvider} from "../services/tracing-service";
import {getInstance as englishCharValidatorProvider} from "../services/input-validators/english-char-validator";

const autoCompleteService = autoCompleteServiceProvider();
const tracer = metricServiceProvider();
const englishCharValidator = englishCharValidatorProvider();
export const v1Router = Router();

// TODO: the language routes could also be extracted to a sub router after multiple language support
const lang=  SUPPORTED_LANGUAGES.EN;

v1Router.post('/en/add', async (req: Request, res: Response) => {
    const {wordsToIndex} = req.body; // Assuming the request body contains the document
    //TODO: Implement limited batch update
    if (!wordsToIndex) {
        res.status(400).json({ error: "Please provide a word to index" });
        return;
    }
    const {isValid, error} = await englishCharValidator.validate(wordsToIndex);
    if (!isValid) {
        res.status(400).json({ error: `Please provide a word to index: ${error}` });
        return;
    }
    try {
        await autoCompleteService.addSuggestions(wordsToIndex, lang)
        res.json({ message: `Document indexed successfully`});
    } catch (error) {
        res.status(500).json({ error: `Error indexing document`});
    }
});

v1Router.get('/en/search', async (req: Request, res: Response) => {
    if (!req.query.q || req.query.q === "") {
        res.status(400).json({ error: "Please provide a valid prefix" });
        return;
    }
    const prefix = req.query.q as string
    try {
        const autocompleteWords = await autoCompleteService.getSuggestionsByPrefix(prefix, lang);
        //trace only valid requests
        tracer.searchInvoked();

        //trace empty responses
        if (autocompleteWords.length === 0) {
            tracer.emptyResponse();
        }
        res.json({ results: autocompleteWords });
    } catch (error) {
        res.status(500).json({ error: `Error searching documents, ${error}` });
    }
});

// TODO: Implement full crud API
v1Router.post('/bulk-add', async (req: Request, res: Response) => {
    res.status(501).json({ error: `bulk add operation was not implemented`});
});

v1Router.post('/bulk-delete', async (req: Request, res: Response) => {
    res.status(501).json({ error: `bulk delete operation was not implemented`});
});

v1Router.delete('/en/delete', async (req: Request, res: Response) => {
    res.status(501).json({ error: `Delete operation was not implemented`});
});