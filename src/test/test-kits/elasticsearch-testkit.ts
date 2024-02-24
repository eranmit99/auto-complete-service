export class ElasticsearchTestkit {
    private inMemoryStore = {};

    reset() {
        this.inMemoryStore = {}
    }

    async search(data: any) {
        const charToIndex = data.query.prefix.word.value.charAt(0);
        if (data.query.prefix.word.value === "boom") {
            throw Error("boom")
        }
        return {
            hits: {
                hits: [{
                    _source: {
                        // @ts-ignore
                        word: this.inMemoryStore[`${data.index}_${charToIndex}`] }
                }]
            }
        }
    }

    async index(data: any) {
        if (data.document.word === "boom") {
            throw Error("boom")
        }
        const charToIndex = data.document.word.charAt(0);
        // @ts-ignore
        this.inMemoryStore[`${data.index}_${charToIndex}`] = data.document.word
    }
}