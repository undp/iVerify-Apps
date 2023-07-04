import { HttpException, HttpService, Injectable } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { WpConfig } from "./config";
import { CreateCategoryDto } from "./interfaces/create-category.dto";
import { CreateMediaDto } from "./interfaces/create-media.dto";
import { CreatePostDto } from "./interfaces/create-post.dto";
import { CreateTagDto } from "./interfaces/create-tag.dto";

@Injectable()
export class WpClientService{

    private pendingPostCreates = {};
    
    constructor(private http: HttpService, private config: WpConfig){}

    private readonly auth = {auth: this.config.authParams};

    publishPost(post: CreatePostDto, id?: number): Observable<any>{
        const endPoint = id ? `${this.config.endpoints.posts}/${id}` : this.config.endpoints.posts;

        const checkId = post.fields.check_id;
        if (checkId && this.pendingPostCreates[checkId]) {
            console.log('Post already in pending create', checkId)
            return;
        }
        this.pendingPostCreates[checkId] = true;
        return this.http.post(endPoint, post, this.auth).pipe(
            map(res => { 
                setTimeout(() => {
                    console.log('publishing post done', checkId)
                    delete this.pendingPostCreates[checkId];
                }, 20000);
                return res.data 
            }),
            catchError(err => {
                setTimeout(() => {
                    console.log('Error publishing post', err)
                    delete this.pendingPostCreates[checkId];
                }, 20000);
                throw new HttpException(err.message, 500);
              })
        );
    }

    getPost(postId: number){
        return this.http.get(this.config.endpoints.posts + '/' + postId, this.auth).pipe( 
            map(res => res.data),
            catchError(err => {
                console.log('Error getting post', err)
                throw new HttpException(err.message, 500);
              })
        );
    }

    getPostByTitle(title: string){
        const params = {title};

        return this.http.get(this.config.endpoints.posts, {params, ...this.auth}).pipe( 
            map(res => res.data),
            catchError(err => {
                console.log('Error getting post', err)
                throw new HttpException(err.message, 500);
              })
        );
    }

    getPostByCheckId(check_id: string){
        const params = {check_id};
        return this.http.get(this.config.endpoints.posts, {params, ...this.auth}).pipe( 
            map(res => res.data),
            catchError(err => {
                console.log('Error getting post by check id', err)
                throw new HttpException(err.message, 500);
              })
        );
    }

    createTag(tag: CreateTagDto): Observable<any>{
        return this.http.post(this.config.endpoints.tags, tag, this.auth).pipe(
            map(res => res.data.id),
            catchError(err => {
                if(err.response.data && err.response.data.code && err.response.data.code === 'term_exists') {
                    return of(err.response.data.data.term_id)
                } else {
                    console.log('Error creating tag: ', err)
                    throw new HttpException(err.message, 500);
                }
              })
        );
    }

    listTags(): Observable<any>{
        const params = {
            per_page: 100,
        };
        return this.http.get(this.config.endpoints.tags, {params, ...this.auth}).pipe(
            map(res => res.data),
            catchError(err => {
                console.log('Error listing tags: ', err)
                throw new HttpException(err.message, 500);
              })
            );
    }

    createCategory(category: CreateCategoryDto): Observable<any>{
        return this.http.post(this.config.endpoints.categories, category, this.auth).pipe(
            map(res => res.data),
            catchError(err => {
                console.log('Error creating category: ', err)
                throw new HttpException(err.message, 500);
              })
        );
    }

    listCategories(): Observable<any>{
        return this.http.get(this.config.endpoints.categories, this.auth).pipe(
            map(res => res.data),
            catchError(err => {
                console.log('Error listing category: ', err)
                throw new HttpException(err.message, 500);
              })
        );
    }

    createMedia(image: any){
        const headers = {
            'Content-Disposition': 'attachment; filename="image.jpg"',
            'Mime-Type': 'image/jpeg',
            'Content-Type': 'multipart/image',
            'Cache-Control': 'no-cache'
        }
        return this.http.post(this.config.endpoints.media, image, {...this.auth, ...{headers}}).pipe(
            map(res => res.data),
            catchError(err => {
                console.log('Error creating media: ', err)
                throw new HttpException(err.message, 500);
              })
        )
    }

    editMedia(mediaId: number, media: any){
        return this.http.put(this.config.endpoints.media + '/' + mediaId, media, this.auth)
    }

    getAppUser(){
        return this.http.get(this.config.endpoints.currentUser, this.auth).pipe(
            map(res => res.data),
            catchError(err => {
                console.log('Error getting current user: ', err)
                throw new HttpException(err.message, 500);
              })
        )
    }

}
