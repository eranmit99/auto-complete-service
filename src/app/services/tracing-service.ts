/*
DISCLAIMER !!
1. this solution assumes the installation of an additional agent
(it could either be implemented as a sidecar or a single service in the relevant cluster)

2. I am using  the datadog tracer solution here, it could be any other statsD based solution
 */

import {tracer} from 'dd-trace';
import {config} from "../config";

enum METRICS_NAMES  {
    EMPTY_SUGGESTION = "EMPTY_SEARCH_SUGGESTION",
    SEARCH_INVOKED = "SEARCH_INVOKED"
}

class TracingService {

   private defaultLanguage: string;
   constructor() {
       this.defaultLanguage = config.app.defaultLanguage;
       tracer.init({
           service: 'auto-complete-search-server', // Replace with your service name
       });
   }
   //TODO: add additional metrics here
    emptyResponse(lang: string =  this.defaultLanguage) {
       tracer.dogstatsd.increment(`${METRICS_NAMES.EMPTY_SUGGESTION}/${lang}`, 1);
    }
    searchInvoked(lang: string = this.defaultLanguage) {
        tracer.dogstatsd.increment(`${METRICS_NAMES.SEARCH_INVOKED}/${lang}`, 1);
    }
}

let _instance: TracingService;

export function geInstance() {
    if (!_instance) {
        _instance = new TracingService();
    }
    return _instance;
}