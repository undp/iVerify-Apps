import { Article } from "@iverify/iverify-common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ArticlesService{
    private readonly logger = new Logger('ArticlesService');


    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        ) {}



    async saveMany(articles: Article[]){
        const results: Article[] = await Promise.all(
            articles.map(article => this.saveOne(article))
        );
        return results; 
    }

    async saveOne(article: Partial<Article>){
        const newRecord = await this.articleRepository.create(article);
        return this.articleRepository.save(newRecord);
    }
    
}