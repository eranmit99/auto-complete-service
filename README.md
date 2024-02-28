# auto-complete-service
This is a service that provides out of the box auto complete to registered uses 

## Initialize local env

### system pre-requisites
1. docker 
2. npm 


### run local env: 
``npm run start-local``


## Test: 
``npm run test`` 


## What you get inside? 

two working endpoint that could be accessed

usage example

1. Fetch search suggestion according to prefix method
   * method: GET
   * payload: q=$PREFIX
   * example http://localhost:4000/v1/en/search?q=sh


2. Add word suggestion 
   * method: POST
   * payload: `{ wordsToIndex: string }`
   
   * example http://localhost:4000/v1/en/add
     `{ wordsToIndex: "chair" }`
