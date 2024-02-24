import {EnglishCharValidator} from "./english-char-validator";
import {EnglishLanguageValidator} from "./english-language-validator";
import {Validator} from "./validator";
import {SUPPORTED_LANGUAGES} from "../auto-complete-service";

const englishChar = new EnglishCharValidator();
const englishLanguage = new EnglishLanguageValidator();

export const validators : Record<SUPPORTED_LANGUAGES, Validator[]> = {
     "en": [
         englishChar,
         englishLanguage
     ]
}