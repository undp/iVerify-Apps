import { HttpService, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { WpConfig } from "./config";
import { CreatePostDto } from "./interfaces/create-post.dto";
import { CreateTagDto } from "./interfaces/create-tag.dto";

@Injectable()
export class WpClientService{
    
    constructor(private http: HttpService, private config: WpConfig){}

    publishPost(post: CreatePostDto): Observable<any>{
        return this.http.post(this.config.endpoints.posts, post);
    }

    createTag(tag: CreateTagDto): Observable<any>{
        return this.http.post(this.config.endpoints.tags, tag);
    }

    listTags(): Observable<any>{
        return this.http.get(this.config.endpoints.tags);
    }

}