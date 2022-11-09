import { Article } from '@iverify/iverify-common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import * as pMap from 'p-map';

@Injectable()
export class ArticlesService {
    private readonly logger = new Logger('ArticlesService');

    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>
    ) {}

    async saveMany(articles: Article[]) {
        try {
            const results = await pMap(
                articles,
                async (article) => {
                    return this.saveOne(article);
                },
                {
                    concurrency: 2,
                    stopOnError: false,
                }
            );

            return results;
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async saveOne(article: Partial<Article>) {
        this.logger.log(`Saving article ${JSON.stringify(article)}`);
        const newRecord = await this.articleRepository.create(article);
        return await this.articleRepository.save(newRecord);
    }

    async getArticles() {
        return await this.articleRepository.find({});
    }

    async getArticlesByRange(start: string, end: string) {
        return await this.articleRepository.find({
            where: {
                publishDate: Between(start, end),
            },
        });
    }
}
