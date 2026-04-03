// Import the whole library

require("dotenv").config();

const maptilerClient = require('@maptiler/client');



maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY     ;

  (async () => {
    const result = await maptilerClient.geocoding.forward('paris');
    console.dir(result.features[0]);
    // ...
  })()