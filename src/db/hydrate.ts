import { promises as fsPromises, Dirent } from 'fs';
import * as path from 'path';
import * as http from 'http';
import { Client as ElasticSearchClient} from '@elastic/elasticsearch';
import { config } from "../app/config";
import {WORD_INPUT_SOURCE_TYPES} from "../app/services/auto-complete-service";


class Hydrator {
    private elasticClient: ElasticSearchClient | undefined;

    constructor(private connection:string) {
    }

   public async init() {
       //TODO: fix me - it is really shitty but due to the fact this is a setup script I left it like this
       await this.busyWaitForElasticsearch();
       this.elasticClient = new ElasticSearchClient({ node: this.connection});
   }
   public async indexWordsInDirectory(directoryPath: string) {
        try {
            //all files in the data folder should be indexed
            const fileNames: Dirent[] = await fsPromises.readdir(directoryPath, { withFileTypes: true });

            for (const fileName of fileNames) {
                const filePath = `${directoryPath}/${fileName.name}`;
                await this.indexWordsInFile(filePath);
            }
        } catch (error) {
            console.error('Error reading directory or indexing words in bulk:', error);
        }
    }

   private createBulkIndexRequest(words: string[], filePath: string) {
        const body: any[] = [];
        const index: string = config.autoCompleteService.collectionIndex.en;

        for (const word of words) {
            body.push({ index: { _index: index } });
            body.push({
                word,
                source: `${WORD_INPUT_SOURCE_TYPES.INTERNAL}: ${filePath}`,
                timestamps: {
                    created_at: new Date(),
                    last_modified_at: new Date()
                },
                //could be used for future implementation
                search_info: {
                    num_searches: 0,
                    last_searched_at: null
                }
            });
        }
        return body;
    }

   private async indexWordsInFile(filePath: string) {
        try {
            const fileContent = await fsPromises.readFile(filePath, 'utf8');

            const words = new Set(
                fileContent
                    .split(/\s+/)
                    .filter(word => word.trim() !== '')
                    .map(word => word.toLowerCase())
            );

            const bulkIndexRequest = this.createBulkIndexRequest(Array.from(words), filePath)
            // @ts-ignore
            const bulkResponse = await this.elasticClient.bulk({ refresh: true, body: bulkIndexRequest });

            if (bulkResponse.errors) {
                console.error(`Error indexing words in file ${filePath}:`, bulkResponse.errors);
            } else {
                console.log(`Bulk index successful for words in file ${filePath}`);
            }
        } catch (error) {
            console.error(`Error reading file ${filePath} or indexing words in bulk:`, error);
        }
    }

   private async isElasticsearchAvailable(): Promise<boolean> {
       return new Promise((resolve) => {
           const req = http.get(this.connection, (res) => {
               resolve(res.statusCode === 200);
           });

           req.on('error', () => {
               resolve(false);
           });
       });
    }
    private async busyWaitForElasticsearch(): Promise<void> {
        const waitInterval = 1000;

        while (!(await this.isElasticsearchAvailable())) {
            console.log('Waiting for Elasticsearch...');
            await new Promise((resolve) => setTimeout(resolve, waitInterval));
        }
        console.log('Elasticsearch is available! Continuing...');
    }
}

(async () => {
    const directoryPath: string = path.resolve(__dirname, './data');
    const elasticConnection =  `http://${config.elasticsearch.host}:${config.elasticsearch.port}`
    const hydrator = new Hydrator(elasticConnection);
    await hydrator.init();

    //import data from file
    await hydrator.indexWordsInDirectory(directoryPath);
})()