import {AutoCompleteService, Config, SUPPORTED_LANGUAGES} from "../../app/services/auto-complete-service";
import {validators} from "../../app/services/input-validators";
import {Client as ElasticsearchClient} from '@elastic/elasticsearch';
import {ElasticsearchTestkit} from "../test-kits/elasticsearch-testkit";
import {AutocompleteWorDocumentDAL} from "../../app/dal/AutocompleteWorDocumentDAL";

const elasticsearchTestkit = new ElasticsearchTestkit() as unknown as ElasticsearchClient & ElasticsearchTestkit;

const config = {} as Config

describe('Testing the auto complete service', () => {
    const wordDal = new AutocompleteWorDocumentDAL(elasticsearchTestkit, config)
    const autoCompleteService =
        new AutoCompleteService(wordDal, validators, config);

    beforeEach(()=>{
        elasticsearchTestkit.reset();
    })
    describe('Testing getSuggestionsByPrefix', () => {

        it('should return the inserted suggestion', async () => {
            await autoCompleteService.addSuggestions("chair", SUPPORTED_LANGUAGES.EN)
            const res = await autoCompleteService.getSuggestionsByPrefix("c", SUPPORTED_LANGUAGES.EN)

            expect(res).toEqual(["chair"]);
        });

        it('should return an empty array', async () => {
            const res = await autoCompleteService.getSuggestionsByPrefix("c", SUPPORTED_LANGUAGES.EN)
            expect(res).toEqual([]);
        });

        it('should throw an error', async () => {
            try {
                await autoCompleteService.getSuggestionsByPrefix("boom", SUPPORTED_LANGUAGES.EN)
            } catch (err) {
                // @ts-ignore
                expect(err.message).toEqual("boom");
            }
        });
    });

    describe('Testing addSuggestions', () => {

        it('should return the inserted suggestion', async () => {
            await autoCompleteService.addSuggestions("chair", SUPPORTED_LANGUAGES.EN)
            const res = await autoCompleteService.getSuggestionsByPrefix("c", SUPPORTED_LANGUAGES.EN)

            expect(res).toEqual(["chair"]);
        });

        it('should return the inserted suggestion', async () => {
            const res = await autoCompleteService.addSuggestions("א", SUPPORTED_LANGUAGES.EN)
            expect(res).toEqual({ error: "str contains non english chars", isValid: false });
        });

        it('should throw an error', async () => {
            try {
                await autoCompleteService.addSuggestions("boom", SUPPORTED_LANGUAGES.EN)
            } catch (err) {
                // @ts-ignore
                expect(err.message).toEqual("boom");
            }
        });
    });
});