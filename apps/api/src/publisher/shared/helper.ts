import { Injectable } from '@nestjs/common';
import { isEmpty } from 'radash';

@Injectable()
export class SharedHelper {
    private extractReport(report: any) {
        if (!isEmpty(report.report)) {
            report = report.report;
        }

        return report;
    }

    extractTask(report: any, label: string) {
        report = this.extractReport(report);

        const edges = report.tasks.edges;
        if (!edges.length) return '';
        const node = edges.find((node) => node.node.label === label);
        const res =
            node && node.node.first_response_value
                ? node.node.first_response_value
                : '';
        return res;
    }

    extractTags(report: any): string[] {
        report = this.extractReport(report);
        return report.tags.edges.reduce((acc, val) => {
            acc = [...acc, val.node.tag_text];
            return acc;
        }, []);
    }

    extractFactcheckingStatus(report: any) {
        report = this.extractReport(report);
        const field = report.annotation.data.fields.find(
            (field) => field.field_name === 'verification_status_status'
        );
        return field.formatted_value;
    }

    extractTitle(report: any) {
        report = this.extractReport(report);
        return report.title || '';
    }

    extractCreationDate(report: any) {
        if (isEmpty(report)) return '';
        report = this.extractReport(report);
        const dateString: string = new Date(
            parseInt(report.created_at) * 1000
        ).toISOString();
        console.log('Extracted creation date: ', dateString);
        return dateString;
    }

    extractDescription(report: any) {
        report = this.extractReport(report);
        return report.description || '';
    }

    extractDbid(report: any) {
        report = this.extractReport(report);
        return report.dbid || '';
    }

    extractSourceDomain(report: any) {
        report = this.extractReport(report);
        return report.domain || '';
    }

    extractSourceName(report: any) {
        report = this.extractReport(report);
        return report.source ? report.source.name : '';
    }
}
