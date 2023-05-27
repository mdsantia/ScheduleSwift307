const {MongoClient} = require("mongodb");

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const username = "mickydsantiago"
const pwd = "vPkeiFUONeFbU0l6"

const url = `mongodb+srv://${username}:${pwd}@cluster0.3hhn9en.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        
        console.log(`HELLO`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit();
    } finally {
        await client.close();
    }
};

main();