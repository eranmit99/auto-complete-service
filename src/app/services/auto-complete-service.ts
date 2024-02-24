import {config} from "../config";
import {validators} from "./input-validators";
import {ValidationResponse, Validator} from "./input-validators/validator";
import {geInstance as wordDalProvider, AutocompleteWorDocumentDAL} from "../dal/AutocompleteWorDocumentDAL";

export type Config = {
    dbIndex?: string
    elasticsearch: {
        host: string,
        port: string
   }
}
export enum WORD_INPUT_SOURCE_TYPES {
    USER = "USER",
    INTERNAL = "INTERNAL"
}

export enum SUPPORTED_LANGUAGES {
    EN = "en"
}

export class AutoCompleteService {
    private readonly DEFAULT_DB_INDEX = 'en-auto-complete';
    private readonly dbIndex;

    constructor(private wordDal: AutocompleteWorDocumentDAL, private validators: Record<SUPPORTED_LANGUAGES, Validator[]>, private config: Config) {
         this.dbIndex = this.config.dbIndex || this.DEFAULT_DB_INDEX;
    }
    async addSuggestions(word: string, lang: SUPPORTED_LANGUAGES): Promise<ValidationResponse | undefined>  {
        if (!this.validators[lang]) {
            throw Error("Unsupported language was provided");
        }
        for (const validator of this.validators[lang]) {
            // @ts-ignore
            const response = await validator.validate(word);
            if (!response.isValid) {
                return response;
            }
        }
        try {
            await this.wordDal.insertWord(word)
        } catch (err) {
            //in real world I would use a logger lib
            console.error("Failed to index document", err);
            throw err;
        }
    }
    async getSuggestionsByPrefix(prefix: string, lang: SUPPORTED_LANGUAGES): Promise<string[]> {
        try {
            return this.wordDal.fetchWords(prefix, lang)
        }  catch (err) {
            console.error("Failed to fetch document", err);
            throw err
        }
    }
}

let _instance: AutoCompleteService;
export function geInstance() {
    if (!_instance) {
        const url =  `http://${config.elasticsearch.host}:${config.elasticsearch.port}`
        const wordDal = wordDalProvider();
        _instance = new  AutoCompleteService(wordDal, validators, config);
    }
    return _instance;
}