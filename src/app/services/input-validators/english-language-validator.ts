import {Validator, ValidationResponse} from "./validator";

export class EnglishLanguageValidator implements Validator {

    public name = "EnglishLanguageValidator";
   async validate(str: string) : Promise<ValidationResponse> {
        // TODO: check english words API if this is valid
        return {
            isValid: true,
            error: null
        }
    }
}
