import {getInstance as englishCharValidatorProvider} from "../../app/services/input-validators/english-char-validator";

describe('Testing the input validators', () => {

    describe('EnglishCharValidator', () => {
        const engCharValidator = englishCharValidatorProvider();

        it('should be return inValid response',async () => {
            const res =  await engCharValidator.validate("א");
            expect(res).toEqual({
                isValid: false,
                error: "str contains non english chars"
            });
        });

        it('should be return valid response', async () => {
            const res =  await engCharValidator.validate("a");
            expect(res).toEqual({
                isValid: true,
                error: null
            });
        });
    });


    describe('EnglishLanguageValidator', () => {
        it('should be return inValid response', () => {
            // TODO: implement
            expect(1).toBe(1);
        });

        it('should be return valid response', () => {
            // TODO: implement
            expect(1).toBe(1);
        });
    });
});