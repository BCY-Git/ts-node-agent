export interface VectorStoreItem {
    embedding:number[];
    document: string;
}

export default class VectorStore {

private vectorStore: VectorStoreItem[];

constructor() {
    this.vectorStore= [];//初始化向量存储库
}

async addItem(items: VectorStoreItem) {
    this.vectorStore.push(items);
}


async search(queryEmbedding: number[], topK: number = 3){
const scores = this.vectorStore.map(item => ({
    document: item.document,
    score: this.consineSim(item.embedding, queryEmbedding)
}));
return scores.sort((a, b) => b.score - a.score).slice(0, topK);//返回最相似的topK个结果,slice的作用是截取数组
}

private consineSim(v1:number[], v2:number[]){
    const dotProduct = v1.reduce((acc, val, i) => acc + val * v2[i], 0);
    const v1Norm = Math.sqrt(v1.reduce((acc, val) => acc + val ** 2, 0));
    const v2Norm = Math.sqrt(v2.reduce((acc, val) => acc + val ** 2, 0));
    return dotProduct / (v1Norm * v2Norm);
}


}
