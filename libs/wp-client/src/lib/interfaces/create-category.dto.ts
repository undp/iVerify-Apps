export interface CreateCategoryDto{
    description?: string
    name: string
    slug?: string
    parent?: number
    meta?: Object
}