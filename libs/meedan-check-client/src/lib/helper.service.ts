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

    buildCreateItemFromWPMutation(url: string, content: string): string{
      const folderId = 11193;
      const taskResponse = JSON.stringify({
        website_tipline_message: content
      })
      const mutation = `mutation create{
          createProjectMedia(input: {
            project_id: ${folderId},
            url: "${url}",
            set_tasks_responses: ${JSON.stringify(taskResponse)},
            clientMutationId: "1"
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
          detoxify_score: toxicityScores.toxicity, 
          detoxify_severe_toxicity_score: toxicityScores.severe_toxicity, 
          detoxify_obscene_score: toxicityScores.obscene, 
          detoxify_identity_attack_score: toxicityScores.identity_attack, 
          detoxify_insult_score: toxicityScores.insult, 
          detoxify_threat_score: toxicityScores.threat, 
          detoxify_sexual_explicit_score: toxicityScores.sexual_explicit
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
        archived: 0
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
      const searchQuery = JSON.stringify({
        range: {
          created_at: {
            start_time: startDate,
            end_time: endDate
          }
        },
        archived: 0
      });

      return `query {
        search (query: ${JSON.stringify(searchQuery)}) {
        number_of_results
        medias {
          edges {
            node {
              status
              tasks {
                edges {
                  node {
                    id
                    label
                    first_response_value
                  }
                }
              }
              }
            }
          }
        }
      }`;
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
        archived: 0    
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

    buildTicketsByTagQuery(startDate: string, endDate: string, tag) {
      
      const searchQuery = JSON.stringify({
        range: {
          created_at: {
            start_time: startDate,
            end_time: endDate
          }
        },
        tags: [tag],
        archived: 0
      })
      return `query {
        search(query: ${JSON.stringify(searchQuery)}) {
          number_of_results
        }
      }`
    }

    buildTicketsByStatusQuery(startDate: string, endDate: string, status: string){
      const searchQuery = JSON.stringify({
        range: {
          created_at: {
            start_time: startDate,
            end_time: endDate
          }
        },
        verification_status: [status],
        archived: 0
      });

      return `query {
        search(query: ${JSON.stringify(searchQuery)}) {
          number_of_results
        }
      }`
    }

    buildCreatedVsPublishedQuery(startDate: string, endDate: string, publishedStatus: string){
      const searchQuery = JSON.stringify({
        range: {
          created_at: {
            start_time: startDate,
            end_time: endDate
          }
        },
        report_status: [publishedStatus],
        archived: 0
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