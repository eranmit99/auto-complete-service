import {Validator, ValidationResponse} from "./validator";

export class EnglishCharValidator implements Validator {
    public name = "EnglishCharValidator";
    async validate(str: string) : Promise<ValidationResponse> {
        const englishRegex = /^[A-Za-z]+$/;
        const errorMessage = "str contains non english chars"
        const isValid = englishRegex.test(str);

        return {
            isValid,
            error: isValid ? null : errorMessage
        }
    }
}

export function getInstance() {
    return new EnglishCharValidator()
};