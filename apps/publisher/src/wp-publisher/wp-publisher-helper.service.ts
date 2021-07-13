import { Injectable } from "@nestjs/common";
import { CommentStatus, CreatePostDto, PostFields, PostFormat, PostStatus, TasksLabels } from "libs/wp-client/src/lib/interfaces/create-post.dto";

@Injectable()
export class WpPublisherHelper{
    constructor(){}

    extractMedia(report: any): string{
        return report.media.metadata.picture;
    }

    extractTags(report: any): string[]{
      // return ['Covid-19', 'Elections']
      return report.tags.edges.reduce((acc, val) => {
          acc = [...acc, val.node.tag_text]
          return acc;
      }, []);

    }


    buildPostFromReport(
        report: any, 
        // categories: number[], 
        author: number,
        media: number,
        tags: number[],
        categories: number[]): CreatePostDto{
        
        const status = PostStatus.publish;
        const comment_status = CommentStatus.open;
        const format = PostFormat.standard;
        const content = report.description;
        const check_id = report.dbid;
        const factchecking_status = this.extractFactcheckingStatus(report);
        const claim = this.extractTask(report, TasksLabels.claim);
        const rating_justification = this.extractTask(report, TasksLabels.rating_justification);
        const evidence_and_references = this.extractTask(report, TasksLabels.evidences_and_references);
        const fields: PostFields = {check_id, factchecking_status, claim, rating_justification, evidence_and_references};
       
    
        const post: CreatePostDto = {
          format,
          author,
          title: claim,
          comment_status,
          status,
          featured_media: media,
          tags,
          fields,
          categories
        }

        return post;
    }

    extractTask(report: any, label){
      const edges = report.tasks.edges;
      if(!edges.length) return '';
      const node =  edges.find(node => node.node.label === label);
      const res = node && node.node.first_response_value ? node.node.first_response_value : '';
      return res;
    }

    extractFactcheckingStatus(report){
      const field = report.annotation.data.fields.find(field => field.field_name === 'verification_status_status');
      return field.formatted_value;
    }
}



const exampleResponse = {
  "data": {
    "project_media": {
      "annotation": {
        "data": {
          "fields": [
            {
              "annotation_id": 9297967,
              "annotation_type": "verification_status",
              "created_at": "2021-06-03T15:58:56.072Z",
              "field_name": "content",
              "field_type": "text",
              "formatted_value": "Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
              "id": 10128487,
              "updated_at": "2021-06-03T16:13:31.788Z",
              "value": "Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
              "value_json": {}
            },
            {
              "annotation_id": 9297967,
              "annotation_type": "verification_status",
              "created_at": "2021-06-03T15:58:56.106Z",
              "field_name": "date_published",
              "field_type": "text",
              "formatted_value": "",
              "id": 10128489,
              "updated_at": "2021-06-03T15:58:56.106Z",
              "value": "",
              "value_json": {}
            },
            {
              "annotation_id": 9297967,
              "annotation_type": "verification_status",
              "created_at": "2021-06-03T15:58:56.134Z",
              "field_name": "external_id",
              "field_type": "text",
              "formatted_value": "",
              "id": 10128491,
              "updated_at": "2021-06-03T15:58:56.134Z",
              "value": "",
              "value_json": {}
            },
            {
              "annotation_id": 9297967,
              "annotation_type": "verification_status",
              "created_at": "2021-06-03T15:58:56.091Z",
              "field_name": "published_article_url",
              "field_type": "text",
              "formatted_value": "",
              "id": 10128488,
              "updated_at": "2021-06-03T15:58:56.091Z",
              "value": "",
              "value_json": {}
            },
            {
              "annotation_id": 9297967,
              "annotation_type": "verification_status",
              "created_at": "2021-06-03T15:58:56.120Z",
              "field_name": "raw",
              "field_type": "text",
              "formatted_value": "",
              "id": 10128490,
              "updated_at": "2021-06-03T15:58:56.120Z",
              "value": "",
              "value_json": {}
            },
            {
              "annotation_id": 9297967,
              "annotation_type": "verification_status",
              "created_at": "2021-06-03T15:58:56.051Z",
              "field_name": "title",
              "field_type": "text",
              "formatted_value": "TEST - Is Peru the country where there was the higher number of death from COVID-19? ",
              "id": 10128486,
              "updated_at": "2021-06-03T16:13:13.907Z",
              "value": "TEST - Is Peru the country where there was the higher number of death from COVID-19? ",
              "value_json": {}
            },
            {
              "annotation_id": 9297967,
              "annotation_type": "verification_status",
              "created_at": "2021-06-03T15:58:56.008Z",
              "field_name": "verification_status_status",
              "field_type": "select",
              "formatted_value": "Misleading",
              "id": 10128485,
              "updated_at": "2021-06-07T11:33:46.573Z",
              "value": "report-true",
              "value_json": {}
            }
          ],
          "indexable": "Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. . . . . . TEST - Is Peru the country where there was the higher number of death from COVID-19? . report-true"
        }
      },
      "dbid": 571819,
      "description": "Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "media": {
        "metadata": {
          "archives": {
            "archive_org": {
              "location": "https://web.archive.org/web/20210603155856/https://www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html",
              "type": "archive_org",
              "url": "https://www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html"
            },
            "perma_cc": {
              "error": {
                "code": 26,
                "message": "Missing authentication key"
              }
            }
          },
          "author_name": "@lemondefr",
          "author_picture": "https://assets.checkmedia.org/medias/ca6c97a140af62f5476b9d75f1b1ec23/author_picture.jpg",
          "author_url": "https://www.lemonde.fr",
          "description": "Les autorités péruviennes ont réévalué ce bilan, qui était jusqu’ici de 69 000 mort, qui inclura les décès probables et suspects.",
          "embed_tag": "<script src=\"https://pender.checkmedia.org/api/medias.js?archivers=archive_org%2Cperma_cc&url=https%3A%2F%2Fwww.lemonde.fr%2Finternational%2Farticle%2F2021%2F06%2F03%2Fcovid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html\" type=\"text/javascript\"></script>",
          "external_id": "",
          "favicon": "https://www.google.com/s2/favicons?domain_url=www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html",
          "html": "",
          "metrics": {
            "facebook": {
              "comment_count": 0,
              "comment_plugin_count": 0,
              "reaction_count": 0,
              "share_count": 0
            }
          },
          "oembed": {
            "author_name": "@lemondefr",
            "author_url": "https://www.lemonde.fr",
            "height": 200,
            "html": "<iframe src=\"https://www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html\" width=\"800\" height=\"200\" scrolling=\"no\" border=\"0\" seamless>Not supported</iframe>",
            "provider_name": "page",
            "provider_url": "http://www.lemonde.fr",
            "thumbnail_url": "https://img.lemde.fr/2021/06/03/333/0/3556/1778/1440/720/60/0/5bc022d_188150899-000-1u81k8.jpg",
            "title": "Covid-19 : le Pérou, où le bilan de l’épidémie est passé à 184 000 morts, a le plus grand nombre de décès en proportion au monde",
            "type": "rich",
            "version": "1.0",
            "width": 800
          },
          "parsed_at": "2021-06-03 15:58:50 +0000",
          "picture": "https://assets.checkmedia.org/medias/ca6c97a140af62f5476b9d75f1b1ec23/picture.jpg",
          "provider": "page",
          "published_at": "",
          "raw": {
            "json+ld": {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "articleSection": [
                "International",
                "Pérou"
              ],
              "author": [
                {
                  "@type": "Person",
                  "description": "Lima, correspondance",
                  "name": "Amanda Chaparro",
                  "url": "https://www.lemonde.fr/signataires/amanda-chapparo/"
                }
              ],
              "dateCreated": "2021-06-03T12:30:27+02:00",
              "dateModified": "2021-06-03T16:46:17+02:00",
              "datePublished": "2021-06-03T12:30:27+02:00",
              "description": "Les autorités péruviennes ont réévalué ce bilan, qui était jusqu’ici de 69 000 mort, qui inclura les décès probables et suspects.",
              "hasPart": {
                "@type": "WebPageElement",
                "cssSelector": ".paywall",
                "isAccessibleForFree": "False"
              },
              "headline": "Covid-19 : le Pérou, où le bilan de l’épidémie est passé à 184 000 morts, a le plus grand nombre de décès en proportion au monde",
              "image": {
                "@type": "ImageObject",
                "height": "348",
                "url": "https://img.lemde.fr/2021/06/03/333/0/3556/1778/696/348/60/0/5bc022d_188150899-000-1u81k8.jpg",
                "width": "696"
              },
              "isAccessibleForFree": "False",
              "isPartOf": {
                "@type": [
                  "CreativeWork",
                  "Product"
                ],
                "name": "LeMonde.fr : accès aux articles réservés aux abonnés",
                "productID": "lemonde.fr:premium"
              },
              "keywords": [
                "Planète",
                "Coronavirus et pandémie de Covid-19",
                "International",
                "Amériques",
                "Pérou"
              ],
              "mainEntityOfPage": {
                "@id": "https://www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html",
                "@type": "WebPage"
              },
              "publisher": {
                "@type": "Organization",
                "logo": {
                  "@type": "ImageObject",
                  "height": "42",
                  "url": "https://s1.lemde.fr/medias/web/1.2.705/img/elements_lm/logo_lm_print.png",
                  "width": "240"
                },
                "name": "Le Monde"
              }
            },
            "metatags": [
              {
                "charset": "UTF-8"
              },
              {
                "content": "IE=edge",
                "http-equiv": "X-UA-Compatible"
              },
              {
                "content": "width=device-width, initial-scale=1, shrink-to-fit=no",
                "name": "viewport"
              },
              {
                "content": "no-referrer-when-downgrade",
                "name": "referrer"
              },
              {
                "content": "#ffffff",
                "name": "theme-color"
              },
              {
                "content": "index, follow, noarchive",
                "name": "robots"
              },
              {
                "content": "max-video-preview:3",
                "name": "robots"
              },
              {
                "content": "max-image-preview:large",
                "name": "robots"
              },
              {
                "content": "max-snippet:-1",
                "name": "robots"
              },
              {
                "content": "Les autorités péruviennes ont réévalué ce bilan, qui était jusqu’ici de 69 000 mort, qui inclura les décès probables et suspects.",
                "name": "description"
              },
              {
                "content": "Le Monde.fr",
                "property": "og:site_name"
              },
              {
                "content": "fr_FR",
                "property": "og:locale"
              },
              {
                "content": "Covid-19 : le Pérou, où le bilan de l’épidémie est passé à 184 000 morts, a le plus grand nombre de décès en proportion au monde",
                "property": "og:title"
              },
              {
                "content": "Les autorités péruviennes ont réévalué ce bilan, qui était jusqu’ici de 69 000 mort, qui inclura les décès probables et suspects.",
                "property": "og:description"
              },
              {
                "content": "https://www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html",
                "property": "og:url"
              },
              {
                "content": "article",
                "property": "og:type"
              },
              {
                "content": "https://img.lemde.fr/2021/06/03/333/0/3556/1778/1440/720/60/0/5bc022d_188150899-000-1u81k8.jpg",
                "property": "og:image"
              },
              {
                "content": "1440",
                "property": "og:image:width"
              },
              {
                "content": "720",
                "property": "og:image:height"
              },
              {
                "content": "image/jpeg",
                "property": "og:image:type"
              },
              {
                "content": "International",
                "property": "og:article:section"
              },
              {
                "content": "locked",
                "property": "og:article:content_tier"
              },
              {
                "content": "Amanda Chaparro",
                "property": "og:article:author"
              },
              {
                "content": "2021-06-03T10:30:27+00:00",
                "property": "og:article:published_time"
              },
              {
                "content": "summary_large_image",
                "name": "twitter:card"
              },
              {
                "content": "@lemondefr",
                "name": "twitter:site"
              },
              {
                "content": "https://www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html",
                "property": "twitter:url"
              },
              {
                "content": "Covid-19 : le Pérou, où le bilan de l’épidémie est passé à 184 000 morts, a le plus grand nombre de décès en proportion au monde",
                "property": "twitter:title"
              },
              {
                "content": "Les autorités péruviennes ont réévalué ce bilan, qui était jusqu’ici de 69 000 mort, qui inclura les décès probables et suspects.",
                "property": "twitter:description"
              },
              {
                "content": "https://img.lemde.fr/2021/06/03/333/0/3556/1778/1440/720/60/0/5bc022d_188150899-000-1u81k8.jpg",
                "property": "twitter:image"
              },
              {
                "content": "lmfr://element/article/6082667?x4=8&xto=AL-8-[Autres]",
                "property": "al:ios:url"
              },
              {
                "content": "lmfr://element/article/6082667?x4=8&xto=AL-8-[Autres]",
                "property": "al:android:url"
              },
              {
                "content": "166878320861",
                "property": "fb:app_id"
              },
              {
                "content": "14892757589",
                "property": "fb:page_id"
              }
            ]
          },
          "refreshes_count": 1,
          "screenshot": "",
          "title": "Covid-19 : le Pérou, où le bilan de l’épidémie est passé à 184 000 morts, a le plus grand nombre de décès en proportion au monde",
          "type": "item",
          "url": "https://www.lemonde.fr/international/article/2021/06/03/covid-19-le-perou-affiche-le-plus-mauvais-bilan-du-monde_6082667_3210.html",
          "username": "",
          "webhook_called": 1
        }
      },
      "tags": {
        "edges": [
          {
            "node": {
              "id": "VGFnLzkyOTgwOTU=\n",
              "tag_text": "Covid-19"
            }
          }
        ]
      },
      "tasks": {
        "edges": [
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": null,
              "label": "Threat level"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": null,
              "label": "Type of Violation"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": null,
              "label": "Content type"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": "Here Users would describe the item claims. Where it originated from, where it was shared from. This section can be middle length. Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Test edit...",
              "label": "Claim"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": "Here user explains why the status of the report is as it is. This section might be automated. Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              "label": "Rating Justification"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": "- Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n- Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n- https://www.bing.com/search?q=place+holders+design+text&qs=n&form=QBRE&msbsrank=1_1__0&sp=-1&pq=place+holders+design+text&sc=1-25&sk=&cvid=7AAC3D910E0640469131D58AF058CFA0",
              "label": "Evidences and References"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": null,
              "label": "Counter-narrative response (short)"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": "Covid-19 _ le Pérou, où le bilan de l’épidémie est passé à 184 000 morts, a le plus grand nombre de décès en proportion au monde.pdf",
              "label": "Post screenshot"
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": "Peru (-6.8699697, -75.0458515)",
              "label": "Where did this event happen? "
            }
          },
          {
            "node": {
              "fieldset": "metadata",
              "first_response_value": null,
              "label": "When was this incident first reported?"
            }
          }
        ]
      },
      "title": "TEST - Is Peru the country where there was the higher number of death from COVID-19? "
    }
  }
}
