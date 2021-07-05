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

    buildTicketsByAgentQuery(startDate: Date, endDate: Date){
      return '';
    }

    buildTicketsByTypeQuery(startDate: Date, endDate: Date){
      return '';
    }

    buildTicketsByChannelQuery(startDate: Date, endDate: Date){
      return '';
    }

    buildTicketsBySourceQuery(startDate: Date, endDate: Date){
      return '';
    }

    buildTicketsByTagQuery(startDate: Date, endDate: Date){
      return '';
    }

    buildTicketsByStatusQuery(startDate: Date, endDate: Date){
      return '';
    }

    buildCreatedVsPublishedQuery(startDate: Date, endDate: Date){
      return '';
    }
}