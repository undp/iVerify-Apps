import { Injectable } from "@nestjs/common";

@Injectable()
export class WpConfig{
    readonly WP_URL = process.env.WP_URL;
    readonly apiBase = this.WP_URL + '/wp-json/wp/v2'

    readonly endpoints = {
        posts: `${this.apiBase}/posts`,
        tags: `${this.apiBase}/tags`,
        categories: `${this.apiBase}/categories`,
        media: `${this.apiBase}/media`,
        currentUser: `${this.apiBase}/users/me`

    }

    readonly authParams = {
        username: process.env.WP_USERNAME,
        password: process.env.WP_PASSWORD

    }

}