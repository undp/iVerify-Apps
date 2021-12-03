import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "@iverify/iverify-common";
import { ArticlesService } from "./articles.service";
import { ArticlesController } from "./articles.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Article])],
    controllers: [ArticlesController],
    providers: [ArticlesService]
})
export class ArticlesModule{}