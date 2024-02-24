import {config} from "../config";
import {Client as ElasticsearchClient} from "@elastic/elasticsearch";
import {Config, WORD_INPUT_SOURCE_TYPES} from "../services/auto-complete-service";

export class AutocompleteWorDocumentDAL {
  private readonly DEFAULT_DB_INDEX = 'en-auto-complete';
  private readonly dbIndex;
  constructor(private dbClient: ElasticsearchClient, private config: Config) {
      this.dbIndex = this.config.dbIndex || this.DEFAULT_DB_INDEX;
  }
  async insertWord(word: string, source?: string): Promise<boolean>  {
       try {
           await this.dbClient.index({
               index: this.dbIndex,
               document: {
                   word,
                   source: source || WORD_INPUT_SOURCE_TYPES.USER
               },
           });
           return true;
       } catch (err) {
           throw err
       }
    }

    async fetchWords(prefix: string, land: string): Promise<string[]> {
        const body = await this.dbClient.search({
            index: this.dbIndex,
            query: {
                prefix: {
                    word: {
                        value: prefix.toLowerCase(),  // Ensure consistent case for case-insensitive search
                    },
                },
            },
        });
        return body.hits.hits.map((hit: any) => hit._source.word);
    }
}


let _instance: AutocompleteWorDocumentDAL;
export function geInstance() {
    if (!_instance) {
        const url =  `http://${config.elasticsearch.host}:${config.elasticsearch.port}`
        const elasticClient = new ElasticsearchClient({ node: url })
        _instance = new  AutocompleteWorDocumentDAL(elasticClient, config);
    }
    return _instance;
}


