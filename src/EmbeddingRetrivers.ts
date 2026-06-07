import VectorStore from "./VectorStore.js";

export default class EmbeddingRetrivers {
    private embeddingModel: string;
    private vectorStore: VectorStore;

    constructor(embeddingModel: string) {
        this.embeddingModel = embeddingModel;
        this.vectorStore = new VectorStore();//不需要入参，new 出来直接是空的就行了
    }

    public async embedQuery(query: string): Promise<number[]> {//不需要加入向量存储
        const embedding = await this.embed(query);
        return embedding;
    }
    public async embedDocuments(document: string): Promise<number[]> {//需要加入向量存储
        const embedding = await this.embed(document);
        this.vectorStore.addItem({
            embedding: embedding, 
            document: document
        });
        return embedding;
    }
    private async embed(document: string): Promise<number[]> {
        const response = await fetch(`${process.env.OLLAMA_API_URL}/embedding`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
            },
            body: JSON.stringify({
                model: this.embeddingModel,
                input: document,
            }),
        });
        const data = await response.json();
        console.log(data.data[0].embedding);
        return data.data[0].embedding;
    }


    async retrieve(query: string, topK: number=3) {
        const queryEmbedding = await this.embedQuery(query);
        return this.vectorStore.search(queryEmbedding, topK);
    }


}
