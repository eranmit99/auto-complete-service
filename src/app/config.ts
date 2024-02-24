export const config = {
    elasticsearch: {
        host: process.env.ELASTICSEARCH_HOST || "localhost",
        port: process.env.ELASTICSEARCH_PORT || "9200",
    },
    autoCompleteService: {
       collectionIndex: {
           en: "en-auto-complete"
       }
    },
    app: {
      port: 4000, //TODO: move this to env
      defaultLanguage: 'en'
    }
}