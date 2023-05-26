const {MongoClient} = require("mongodb");

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