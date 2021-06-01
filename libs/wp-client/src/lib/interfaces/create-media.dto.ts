import { CommentStatus, PingStatus } from "./create-post.dto";

export enum MediaStatus{
    publish = 'publish',
    future = 'future',
    draft = 'draft',
    pending = 'pending',
    private = 'private'
}

export interface CreateMediaDto{
    date?: string
    date_gtm?: string
    slug?: string
    status?: MediaStatus
    title?: string
    author?: number
    comment_status?: CommentStatus
    ping_status?: PingStatus
    meta?: Object
    template?: string
    alt_text?: string
    caption?: string
    description?: string
    post?: number
}