import { Article, TasksLabels } from "@iverify/iverify-common";
import { Injectable } from "@nestjs/common";
import { SharedHelper } from "../shared/helper";

@Injectable()
export class ApiPublisherHelper{
    constructor(private sharedHelper: SharedHelper){}

    buildArticle(report: any, wpPost: any): Partial<Article>{
        const meedanId = this.extractMeedanId(report);
        const wpId = this.extractWpId(wpPost);
        const title = this.extractTitle(report);
        const content = this.extractContent(report);
        const wpUrl = this.extractWpUrl(wpPost);
        const publishDate = this.extractPublishDate(wpPost);
        const tags = this.extractTags(report);
        const threatLevel = this.extractThreathLevel(report);
        const violationType = this.extractViolationType(report);
        const claim = this.extractClaim(report);
        const justification = this.extractJustification(report);
        const evidence = this.extractEvidence(report);
        const misinfoType = this.extractMisinfoType(report);
        const hateSpeechType = this.extractHateSpeechType(report);
        const toxicScore = this.extractToxicScore(report);
        const obsceneScore= this.extractObsceneScore(report);
        const identityScore = this.extractIdentityScore(report);
        const threatScore = this.extractThreatScore(report);
        const explicitScore= this.extractexplicitScore(report);
        const dToxicScore = this.extractDToxicScore(report);
        const dObsceneScore = this.extractDObsceneScore(report);
        const dIdentityScore = this.extractDIdentityScore(report);
        const dThreatScore = this.extractDThreatScore(report);
        const dExplicitScore = this.extractDExplicitScore(report);
        const dInsultScore = this.extractDInsultScore(report);
        const sourceName = this.extractSourceName(report);
        const sourceUrl = this.extractSourceUrl(report);
        const notes = this.extractNotes(report);

        return {
            meedanId,
            wpId,
            wpUrl,
            title,
            content,
            publishDate,
            tags,
            threatLevel,
            violationType,
            claim,
            justification,
            evidence,
            misinfoType,
            hateSpeechType,
            toxicScore,
            obsceneScore,
            identityScore,
            threatScore,
            explicitScore,
            dToxicScore,
            dObsceneScore,
            dIdentityScore,
            dThreatScore,
            dExplicitScore,
            dInsultScore,
            sourceName,
            sourceUrl,
            notes
        }
    }

    extractMeedanId(report: any): number{
        return this.sharedHelper.extractDbid(report);
    }

    extractWpId(wpPost: any): number{
        return 0;
    }

    extractTitle(report: any){
        return this.sharedHelper.extractTitle(report);
    }

    extractContent(report: any){
        return this.sharedHelper.extractDescription(report);
    }

    extractWpUrl(wpPost: any){
        return '';
    }

    extractPublishDate(wpPost: any){
        return '';
    }

    extractTags(report: any){
        const tags: string[] = this.sharedHelper.extractTags(report);
        return tags.reduce((acc, val) => {
            acc = acc + ', ' + val;
            return acc;
        }, '')
    }

    extractThreathLevel(report: any){
        return this.sharedHelper.extractTask(report, TasksLabels.threat_level);
    }

    extractViolationType(report: any){
        return this.sharedHelper.extractTask(report, TasksLabels.violation_type);
    }

    extractClaim(report: any){
        return this.sharedHelper.extractTask(report, TasksLabels.claim);
    }

    extractJustification(report: any){
        return this.sharedHelper.extractTask(report, TasksLabels.rating_justification);
    }

    extractEvidence(report: any){
        return this.sharedHelper.extractTask(report, TasksLabels.evidences_and_references);
    }

    extractMisinfoType(report: any){
        return this.sharedHelper.extractTask(report, TasksLabels.disinfo_type);
    }

    extractHateSpeechType(report: any){
        return this.sharedHelper.extractTask(report, TasksLabels.hate_speech_type);
    }

    extractToxicScore(report: any): number{
        return this.sharedHelper.extractTask(report, TasksLabels.toxic_score);
    }

    extractObsceneScore(report: any): number{
        return this.sharedHelper.extractTask(report, TasksLabels.obscene_score);
    }

    extractIdentityScore(report: any): number{
        return this.sharedHelper.extractTask(report, TasksLabels.identity_score);
    }

    extractThreatScore(report: any): number{
        return this.sharedHelper.extractTask(report, TasksLabels.threat_score);
    }

    extractexplicitScore(report: any): number{
        return this.sharedHelper.extractTask(report, TasksLabels.sexually_explicit_score);
    }

    extractDToxicScore(report: any): number{
        return 0;
    }

    extractDObsceneScore(report: any): number{
        return 0;
    }

    extractDIdentityScore(report: any): number{
        return 0;
    }

    extractDThreatScore(report: any): number{
        return 0;
    }

    extractDExplicitScore(report: any): number{
        return 0;
    }

    extractDInsultScore(report: any): number{
        return 0;
    }

    extractSourceName(report: any){
        return this.sharedHelper.extractSourceName(report);
    }

    extractSourceUrl(report: any){
        return this.sharedHelper.extractSourceDomain(report);
    }

    extractNotes(report: any){
        return '';
    }
}
