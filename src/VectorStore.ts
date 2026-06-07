export interface VectorStoreItem {
    embedding:number[];
    document: string;
}

export default class VectorStore {

private vectorStore: VectorStoreItem[];

constructor() {
    this.vectorStore= [];//初始化向量存储库
}

async addItem(items: VectorStoreItem[]) {
    this.vectorStore.push(...items);
}


async search(){

}


}
