import { HttpService, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { WpConfig } from "./config";
import { CreateCategoryDto } from "./interfaces/create-category.dto";
import { CreateMediaDto } from "./interfaces/create-media.dto";
import { CreatePostDto } from "./interfaces/create-post.dto";
import { CreateTagDto } from "./interfaces/create-tag.dto";

@Injectable()
export class WpClientService{
    
    constructor(private http: HttpService, private config: WpConfig){}

    private readonly auth = {auth: this.config.authParams};

    publishPost(post: CreatePostDto): Observable<any>{
        return this.http.post(this.config.endpoints.posts, post, this.auth).pipe(
            map(res => res.data)
        );
    }

    createTag(tag: CreateTagDto): Observable<any>{
        return this.http.post(this.config.endpoints.tags, tag, this.auth).pipe(
            map(res => res.data)
        );
    }

    listTags(){
        return this.http.get(this.config.endpoints.tags).pipe(map(res => res.data));
    }

    createCategory(category: CreateCategoryDto): Observable<any>{
        return this.http.post(this.config.endpoints.categories, category, this.auth).pipe(
            map(res => res.data)
        );
    }

    listCategories(): Observable<any>{
        return this.http.get(this.config.endpoints.categories, this.auth).pipe(
            map(res => res.data)
        );
    }

    createMedia(media: CreateMediaDto){
        return this.http.post(this.config.endpoints.media, media, this.auth).pipe(
            map(res => res.data)
        )
    }

    getAppUser(){
        return this.http.get(this.config.endpoints.currentUser, this.auth).pipe(
            map(res => res.data)
        )
    }

}