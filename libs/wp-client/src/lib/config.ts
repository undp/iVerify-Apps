import { Injectable } from "@nestjs/common";

@Injectable()
export class WpConfig{
    readonly WP_URL = process.env.WP_URL;

    readonly endpoints = {
        posts: `${this.WP_URL}/wp/v2/posts`,
        tags: `${this.WP_URL}/wp/v2/tags`
    }

    readonly authParams = {
        username: process.env.WP_USERNAME,
        paswword: process.env.WP_PASSWORD
    }

}