import { TasksLabels } from '@iverify/common/src';
import { Article } from '@iverify/iverify-common';
import { Injectable } from '@nestjs/common';
import { SharedHelper } from '../shared/helper';

@Injectable()
export class ApiPublisherHelper {
    constructor(private sharedHelper: SharedHelper) {}

    buildArticle(report: any, wpPost: any, language: string): Partial<Article> {
        const meedanId = this.extractMeedanId(report);
        const creationDate = this.extractCreationDate(report);
        const toxicFlag = this.extractToxicFlag(wpPost);
        const wpId = this.extractWpId(wpPost);
        const title = this.extractTitle(report);
        const content = this.extractContent(report);
        const wpUrl = this.extractWpUrl(wpPost);
        const publishDate = this.extractPublishDate(wpPost);
        const tags = this.extractTags(report);
        const threatLevel = this.extractThreathLevel(report, language);
        const violationType = this.extractViolationType(report, language);
        const claim = this.extractClaim(report, language);
        const justification = this.extractJustification(report, language);
        const evidence = this.extractEvidence(report, language);
        const misinfoType = this.extractMisinfoType(report, language);
        const hateSpeechType = this.extractHateSpeechType(report, language);
        const toxicScore = this.extractToxicScore(report, language);
        const obsceneScore = Number(
            this.extractObsceneScore(report, language) ?? 0
        );
        const identityScore = Number(
            this.extractIdentityScore(report, language) ?? 0
        );
        const threatScore = Number(
            this.extractThreatScore(report, language) ?? 0
        );
        const explicitScore = Number(
            this.extractexplicitScore(report, language) ?? 0
        );
        const dToxicScore = Number(
            this.extractDToxicScore(report, language) ?? 0
        );
        const dObsceneScore = Number(
            this.extractDObsceneScore(report, language) ?? 0
        );
        const dIdentityScore = Number(
            this.extractDIdentityScore(report, language) ?? 0
        );
        const dThreatScore = Number(
            this.extractDThreatScore(report, language) ?? 0
        );
        const dExplicitScore = Number(
            this.extractDExplicitScore(report, language) ?? 0
        );
        const dInsultScore = Number(
            this.extractDInsultScore(report, language) ?? 0
        );
        const sourceName = this.extractSourceName(report);
        const sourceUrl = this.extractSourceUrl(report);
        const notes = this.extractNotes(report);

        return {
            meedanId,
            creationDate,
            toxicFlag,
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
            notes,
            locationId: wpPost.locationId,
        };
    }

    extractMeedanId(report: any): number {
        return this.sharedHelper.extractDbid(report);
    }

    extractCreationDate(report: any): string {
        return this.sharedHelper.extractCreationDate(report);
    }

    extractToxicFlag(wpPost: any): boolean {
        return !!wpPost.acf.toxic;
    }

    extractWpId(wpPost: any): number {
        return wpPost.id || '';
    }

    extractTitle(report: any) {
        return this.sharedHelper.extractTitle(report);
    }

    extractContent(report: any) {
        return this.sharedHelper.extractDescription(report);
    }

    extractWpUrl(wpPost: any) {
        return wpPost.link || '';
    }

    extractPublishDate(wpPost: any) {
        return wpPost.date || '';
    }

    extractTags(report: any) {
        const tags: string[] = this.sharedHelper.extractTags(report);
        return tags.reduce((acc, val) => {
            acc = acc + ', ' + val;
            return acc;
        }, '');
    }

    extractThreathLevel(report: any, lang: string) {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].threat_level
        );
    }

    extractViolationType(report: any, lang: string) {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].violation_type
        );
    }

    extractClaim(report: any, lang: string) {
        return this.sharedHelper.extractTask(report, TasksLabels[lang].claim);
    }

    extractJustification(report: any, lang: string) {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].rating_justification
        );
    }

    extractEvidence(report: any, lang: string) {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].evidences_and_references
        );
    }

    extractMisinfoType(report: any, lang: string) {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].disinfo_type
        );
    }

    extractHateSpeechType(report: any, lang: string) {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].hate_speech_type
        );
    }

    extractToxicScore(report: any, lang: string): number {
        const value = this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].toxic_score
        );

        return Number(value) ?? 0;
    }

    extractObsceneScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].obscene_score
        );
    }

    extractIdentityScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].identity_score
        );
    }

    extractThreatScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].threat_score
        );
    }

    extractexplicitScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].sexually_explicit_score
        );
    }

    extractDToxicScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].d_toxic_score
        );
    }

    extractDObsceneScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].d_obscene_score
        );
    }

    extractDIdentityScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].d_identity_score
        );
    }

    extractDThreatScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].d_threat_score
        );
    }

    extractDExplicitScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].sexually_explicit_score
        );
    }

    extractDInsultScore(report: any, lang: string): number {
        return this.sharedHelper.extractTask(
            report,
            TasksLabels[lang].d_insult_score
        );
    }

    extractSourceName(report: any) {
        return this.sharedHelper.extractSourceName(report);
    }

    extractSourceUrl(report: any) {
        return this.sharedHelper.extractSourceDomain(report);
    }

    extractNotes(report: any) {
        return '';
    }
}
