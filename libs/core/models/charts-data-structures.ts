import { CategoryCount, CountBy, StatsResults } from '../../common/src';
import { ChartTypeEnum } from './dashboard';

export interface Model_1{
    name: string
    value: number
    extra?: {
        code: string
    }
}

export interface Model_2{
    name: string
    series: Model_1[]
}

export interface Model_3{
    name: string,
    x: string,
    y: number,
    r: number
}

export interface Model_4{
    name: string
    series: Model_3[]
}

export const ResultsToChartModel = (chartType: ChartTypeEnum, dataType: CountBy, data: any) => {
    switch(chartType){
        case ChartTypeEnum.PIE:
        case ChartTypeEnum.BAR: 
        case ChartTypeEnum.VERTICAL_BAR: 
        // case ChartTypeEnum.ADVANCED_PIE:
        case ChartTypeEnum.PIE_GRID:
        case ChartTypeEnum.TREE_MAP:        
            return ResultsToModel_1(dataType, data);
        case ChartTypeEnum.AREA_STACKED: 
        case ChartTypeEnum.LINE:
        // case ChartTypeEnum.GROUP_HORIZONTAL_BAR:
        // case ChartTypeEnum.GROUP_VERTICAL_BAR:
        // case ChartTypeEnum.HEAT_MAP:
        case ChartTypeEnum.AREA:
        case ChartTypeEnum.NORMALIZED_AREA:              
            return ResultsToModel_2_a(dataType, data);
        case ChartTypeEnum.STACKED:
        case ChartTypeEnum.VERTICAL_BAR_STACKED: 
        case ChartTypeEnum.NORMALIZED_VERTICAL_BAR:
        case ChartTypeEnum.NORMALIZED_HORIZONTAL_BAR:  
            return ResultsToModel_2_b(dataType, data);

        default: return [];
        // case ChartTypeEnum.BUBBLE:
        //     return ResultsToModel_4(dataType, data);        
    }
}

export const ResultsToModel_1 = (dataType: CountBy, data: any): Model_1[] => {
    if(!data) return [];
    const rangeData = data[dataType];
    if(!rangeData) return [];
    const lastSerie: CategoryCount[] = rangeData[Object.keys(rangeData)[Object.keys(rangeData).length -1]];//last item of an object like {2021-12-3: [],..., 2021-12-18: []}
    return lastSerie
    .map(item => ({name: item.category, value: item.count}))
    .sort((a, b) => b.value - a.value);
}

export const ResultsToModel_2_a = (dataType: CountBy, data: any): Model_2[] => {
    if(!data) return [];
    const rangeData = data[dataType];
    if(!rangeData) return [];
    const results = AggregateRangeModel_2_a(rangeData);
    return results.sort((a: any, b: any) => a.name - b.name);
}

export const ResultsToModel_2_b = (dataType: CountBy, data: any): Model_2[] => {
    if(!data) return [];
    if(dataType === CountBy.agentAllStatuses) return AgentsToModel_2_b(data);
    const rangeData = data[dataType];
    if(!rangeData) return [];
    return AggregateRangeModel_2_b(rangeData);
    
}

export const AggregateRangeModel_2_a = (rangeData: any): Model_2[] => {
    const groupedByCategory = Object.keys(rangeData).reduce((acc: any, date) => {
        const dayData = rangeData[date];
        dayData.forEach((d: CategoryCount) => {
            if(!acc[d.category]) acc[d.category] = [{name: date, value: d.count}];
            else acc[d.category] = [...acc[d.category], {name: date, value: d.count}]
        })
        return acc;
    }, {});

    const results = Object.keys(groupedByCategory).reduce((acc, cat) => {
        const series = groupedByCategory[cat];
        acc = [...acc, {name: cat, series}]
        return acc;
    }, []);

    return results;
}

export const AggregateRangeModel_2_b = (rangeData: any): Model_2[] => {
    const results = Object.keys(rangeData).reduce((acc, date: any) => {
        const dayData = rangeData[date];
        const series: Model_1 = dayData.map((d: CategoryCount) => ({name: d.category, value: d.count}));
        acc = [...acc, {name: date, series}];
        return acc;
    }, [])

    return results;
}

export const AgentsToModel_2_b = (data: any): Model_2[] => {
    const unstartedRange = data[CountBy.agentUnstarted];
    const processingRange = data[CountBy.agentProcessing];
    const solvedRange = data[CountBy.agentSolved];

    const unstartedLast = unstartedRange[Object.keys(unstartedRange)[Object.keys(unstartedRange).length -1]];
    const processingLast = processingRange[Object.keys(processingRange)[Object.keys(processingRange).length -1]];
    const solvedLast = solvedRange[Object.keys(solvedRange)[Object.keys(solvedRange).length -1]];

    const toAggregate = {
        unstarted : unstartedLast,
        precessing: processingLast,
        solved: solvedLast
    }

    const aggregated = AggregateRangeModel_2_a(toAggregate);
    return aggregated;
}

export const ResultsToModel_4 = (dataType: CountBy, data: any): Model_1[] => {
    const rangeData = data[dataType];
    const lastSerie: CategoryCount[] = rangeData[Object.keys(rangeData)[Object.keys(rangeData).length -1]];//last item of an object like {2021-12-3: [],..., 2021-12-18: []}
    return lastSerie.map(item => ({name: item.category, value: item.count}));
}