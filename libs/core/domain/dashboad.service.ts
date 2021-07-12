import { Injectable } from '@angular/core';
import { BaseService } from '../../core/base/base-service';
import { Tickets } from '../../core/models/dashboard';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {
  readonly uris = {
    create: 'posts',
    ticketsByRange: 'stats/stats-by-range',
    ticketsByTags: 'stats/tickets-by-tags',
    ticketsByStatus: 'stats/tickets-by-status',
    ticketsBySource: 'stats/tickets-by-source',
    ticketsByAgents: 'stats/tickets-by-agent',
    ticketsCreatedPublished: 'stats/created-vs-published',
    // read: 'posts/:id',
    // update: 'posts/:id',
    // delete: 'posts/:id',
    // geoJson: 'posts/geojson',
    // audit: 'posts/:id/audit?offset=0&limit=20',
    // listComments: 'posts/:post_id/comments',
    // listCommentsByType: 'posts/:post_id/comments/:type',
    // createComment: 'posts/:post_id/comments',
    // updateComment: 'posts/:post_id/comments/:id',
    // deleteComment: 'posts/:post_id/comments/:id'
  };

  list(range: any): Observable<Tickets> {
    return this.http.post<Tickets>(this.getUrl(this.uris.ticketsByRange), range);
  }

  // list(options: ListPostOptions): Observable<Posts> {
  //   return this.http.get<Posts>(this.getUrl(this.uris.list), {
  //     params: super.getParamsFromObject(options)
  //   });
  // }

  // read(id: number): Observable<Post> {
  //   return this.http.get<Post>(
  //     this.getUrl(this.uris.read).replace(':id', id.toString())
  //   );
  // }

  // update(post: Post): Observable<Post> {
  //   return this.http.put<Post>(
  //     this.getUrl(this.uris.update).replace(':id', post.id.toString()),
  //     post
  //   );
  // }

  // delete(post: Post): Observable<Post> {
  //   return this.http.delete<Post>(
  //     this.getUrl(this.uris.update).replace(':id', post.id.toString())
  //   );
  // }

  // geoJson(options: ListPostOptions): Observable<GeoJsonObject> {
  //   return this.http.get<GeoJsonObject>(this.getUrl(this.uris.geoJson), {
  //     params: super.getParamsFromObject(options)
  //   });
  // }

  // listComments(
  //   post_id: number,
  //   type: PostCommentType = null
  // ): Observable<PostComments> {
  //   const lastSegment = window.location.pathname.split("/").pop();
  //   const url = this.getUrl(
  //     type !== null ? this.uris.listCommentsByType : this.uris.listComments
  //   )
  //     .replace(':post_id', post_id.toString())
  //     .replace(':type', type > 0 ? type.toString() : '0')
  //     .replace(':post_type', lastSegment);
  //   return this.http.get<PostComments>(url);
  // }

  // createComment(comment: PostComment): Observable<PostComment> {
  //   return this.http.post<PostComment>(
  //     this.getUrl(this.uris.createComment).replace(
  //       ':post_id',
  //       comment.post_id.toString()
  //     ),
  //     comment
  //   );
  // }

  // updateComment(comment: PostComment): Observable<PostComment> {
  //   return this.http.put<PostComment>(
  //     this.getUrl(this.uris.updateComment)
  //       .replace(':post_id', comment.post_id.toString())
  //       .replace(':id', comment.id.toString()),
  //     comment
  //   );
  // }

  // deleteComment(comment: PostComment): Observable<void> {
  //   return this.http.delete<void>(
  //     this.getUrl(this.uris.deleteComment)
  //       .replace(':post_id', comment.post_id.toString())
  //       .replace(':id', comment.id.toString())
  //   );
  // }

  // getPostAudit(id: number) {
  //   return this.http.get<any>(
  //     this.getUrl(this.uris.audit).replace(':id', id.toString())
  //   );
  // }

  // getPostByFilters(options: FilterOptions) : Observable<any> {
  //   return this.http.post<FilterOptions>(
  //     this.getUrl(this.uris.listPostsCount),
  //     options
  //   );
  // }
}
