export enum PostStatus{
    publish = 'publish',
    future = 'future',
    draft = 'draft',
    pending = 'pending',
    private = 'private'
}

export enum CommentStatus{
    open = 'open',
    closed = 'closed'
}

export enum PingStatus{
    open = 'open',
    closed = 'closed'
}

export enum PostFormat{
    standard = 'standard',
    aside = 'aside',
    chat = 'chat',
    gallery = 'gallery',
    link = 'link',
    image = 'image',
    quote = 'quote',
    status = 'status',
    video = 'video',
    audio = 'audio'
}

export interface PostFields{
    claim: string
    rating_justification: string
    evidence_and_references: string
    check_id: number
    factchecking_status: string
}

export enum TasksLabels{
    claim = 'Claim',
    rating_justification = 'Rating Justification',
    evidences_and_references = 'Evidence and References',
    card_title = 'Card Title'
}

export interface CreatePostDto{
    date?: string
    date_gmt?: string
    slug?: string
    status?: PostStatus
    password?: string
    title?: string
    content?: string
    author?: number
    excerpt?: string
    comment_status?: CommentStatus
    ping_status?: PingStatus
    format?: PostFormat
    sticky?: boolean
    template?: string
    categories?: number[]
    tags?: number[]
    featured_media?: number
    fields?: PostFields
}