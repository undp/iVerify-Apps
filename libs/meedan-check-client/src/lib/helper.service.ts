import { Injectable } from "@nestjs/common";
import { ToxicityScores } from "./interfaces/toxicity-scores";

@Injectable()
export class CheckClientHelperService{

    buildGetReportQuery(id: string){
       return `query {
        project_media(ids: "${id}"){
          title
          description
          dbid
          media {
            metadata
          }
          annotation(annotation_type: "verification_status") {
            data
          }
          tasks {
            edges {
              node {
                fieldset
                label
                first_response_value
              }
            }
          },
          tags {
            edges {
              node {
                id
                tag_text
              }
            }
          }
        }
      }` 
    }

    buildGetMeedanReportQuery(id: string){
      return `query {
       project_media(ids: "${id}"){
         annotation(annotation_type: "report_design") {
           data
         }
       }
     }` 
   }
    
    buildCreateItemMutation(url: string, folderId: number, set_tasks_responses: string): string{
        const mutation = `mutation create{
            createProjectMedia(input: {
              project_id: ${folderId},
              url: "${url}",
              clientMutationId: "1",
              set_tasks_responses: ${JSON.stringify(set_tasks_responses)}
            }) {
              project_media {
                title
                dbid
                id
              }
            }
          }`
        return mutation;

    }

    buildTasksResponses(toxicityScores: ToxicityScores){
        return JSON.stringify({
          toxic_score: toxicityScores.toxicity, 
          severely_toxic_score: toxicityScores.severe_toxicity, 
          obscene_score: toxicityScores.obscene, 
          attack_on_identity_score: toxicityScores.identity_attack, 
          insult_score: toxicityScores.insult, 
          threat_score: toxicityScores.threat, 
          sexually_explicit_score: toxicityScores.sexual_explicit
        })
    }

    buildTicketsByAgentQuery(startDate: string, endDate: string){
      const searchQuery = JSON.stringify({
        range: {
          created_at: {
            start_time: startDate,
            end_time: endDate
          }
        },
        archived: 1
      });


      return `query {
        search (query: ${JSON.stringify(searchQuery)}) {
        number_of_results
        medias {
          edges {
            node {
              status
              account {
                user{
                  name
                }
              }
              }
            }
          }
        }
      }`
    }

    buildTicketsByTypeQuery(startDate: string, endDate: string){
      return '';
    }

    buildTicketsByChannelQuery(startDate: string, endDate: string){
      return '';
    }

    buildTicketsBySourceQuery(startDate: string, endDate: string){
      const searchQuery = JSON.stringify({
        range: {
          created_at: {
            start_time: startDate,
            end_time: endDate
          }
        },
        archived: 1        
      });

      return `query {
        search (query: ${JSON.stringify(searchQuery)}) {
        number_of_results
        medias {
          edges {
            node {
              domain
                source {
                  name
                  }
              }
            }
          }
        }
      }`
    }

    buildTeamTagsQuery(team: string){
     return `query {
        team(slug: "${team}") {
          tag_texts {
            edges {
              node {
                text
              }
            }
          }
        }
      }`
    }

    buildTicketsByTagQuery(tag){
      const searchQuery = JSON.stringify({
        tags: [tag],
        archived: 1
      })
      return `query {
        search(query: ${JSON.stringify(searchQuery)}) {
          number_of_results
        }
      }`
    }

    buildTicketsByStatusQuery(status: string){
      const searchQuery = JSON.stringify({
        verification_status: [status],
        archived: 1
      });

      return `query {
        search(query: ${JSON.stringify(searchQuery)}) {
          number_of_results
        }
      }`
    }

    buildCreatedVsPublishedQuery(publishedStatus: string){
      const searchQuery = JSON.stringify({
        report_status: [publishedStatus],
        archived: 1
      })
      return `query {
        search(query: ${JSON.stringify(searchQuery)}) {
          number_of_results
        }
      }`
    }

    buildTicketLastStatusQuery(id: string){
      return `query {
        project_media(ids: "${id}") {
          title
          created_at
          log(last: 2) {
            edges {
              node {
                event_type
                object_changes_json
                created_at
              }
            }
          }
        }
      }`
    }
}