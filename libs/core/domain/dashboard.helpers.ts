import * as moment from 'moment';
import { isEmpty, orderBy, uniqBy, uniq, flatten, keyBy, sortBy } from 'lodash';
import { TicketsByType, TicketResponseTime, BubbleChartFormat, StatusFormatPieChart, StatusFormat } from '../models/dashboard';
import { environment } from '../environments/environment';
import { TasksLabels } from '@iverify/common/src';

const showItems = 5;
let Statuses: any;
const currentLang = environment.defaultLanguage;
for (const [key, value] of Object.entries(TasksLabels)) {
  Statuses = (key === currentLang) ? value : [];
}

const FormatDate = (date: Date, format: string = 'YYYY-MM-DD') => {
  return moment(date).format(format);
}

const SortStatistics = (results: any) => {

  let data = results;
  if (!isEmpty(data)) {
    for (const [key, value] of Object.entries(data)) {
      const sorted = Object.entries(value).sort((a: any, b: any) => b[1] - a[1]);
      data[key] = sorted;      
    }
  }
  return data;
}

const GetTicketsByType = (res: any) => {
  
  let processedData: any = [];
  if (!isEmpty(res)) {
    processedData = GetCountFromRes(res);
  }
  return processedData;
}

const GetTicketsByChannel = (res: any) => {

  let processedData: any = [];
  if (!isEmpty(res)) {
    res.forEach((value: string[], index: number) => {
      if (!isEmpty(value[0]) && index < showItems) {
        const category = {
          name: value[0],
          value: value[1]
        };
        processedData.push(category);
      }
    });
  }
  return processedData;
};

const GetCountFromRes = (res: any[],  displayItem = showItems) => {

  let modified: any = [];
  if (res && res.length > 0) {
    const lastest = res[res.length - 1][1];
    let data = lastest.filter((itemVal: any) => {
        if (!isEmpty(itemVal)) {
          return (itemVal.count !== 0);
        }
        return false;
    });
    if (data.length > 0) {
      const dataUniq = uniqBy(data, 'category');
      let sortData = orderBy(dataUniq, ['count'], ['desc']); 
      sortData.forEach((value: any, index: number) => {
          if (!isEmpty(value.category) && index < displayItem) {
            const category = {
              name: value.category,
              value: value.count
            };
            modified.push(category);
          }
      });

    }
    
  }
  return modified;
}

const GetTicketsByTag = (res: any[]) => {
  let processedData: any = [];
  if (!isEmpty(res)) {
    processedData = GetCountFromRes(res);
  }
  return processedData;
};

const GetTicketsByCurrentStatus = (res: any) => {
    let processedData: StatusFormatPieChart[] = [];
    if (!isEmpty(res)) {
      const statuses = res.status;

      let newArr = statuses.map((itemVal: any) => {
        let temp = itemVal[1].filter((item: any) => (item.category === Statuses.status_unstarted || item.category === Statuses.status_in_progress || item.category === Statuses.status_pre_checked));
        temp = uniqBy(temp, 'category');
        return temp;
      });
    
      newArr = flatten(newArr);
      let sortData = orderBy(newArr, ['count'], ['desc']); 

      const unstarted = sortData.filter((it: any) => it.category === Statuses.status_unstarted);
      const inprogress = sortData.filter((it: any) => it.category !== Statuses.status_unstarted);
      const precheckedCount = sortData.filter((it: any) => it.category === Statuses.status_pre_checked);

      processedData.push(
        {
          name: unstarted[0].category,
          value: unstarted[0].count + (precheckedCount[0] && precheckedCount[0].count > 0) ? precheckedCount[0].count : 0,
          label: Statuses.status_unstarted
        }, {
          name: inprogress[0].category,
          value: inprogress[0].count,
          label: Statuses.status_in_progress
        }
      );              

      if (!isEmpty(statuses)) {

        let newArr = statuses.map((itemVal: any) => {
          let temp = itemVal[1].filter((item: any) => (item.category !== Statuses.status_unstarted && item.category !== Statuses.status_in_progress && item.category !== Statuses.status_pre_checked));
          temp = uniqBy(temp, 'category');
          return temp;
        });
        newArr = flatten(newArr);
        let sortedPublished = orderBy(newArr, ['count'], ['desc']); 
        sortedPublished = uniqBy(sortedPublished, 'category'); 
        const completedCount = sortedPublished.reduce((acc, curr) => {
            acc['count'] += parseInt(curr.count);
            return acc;
        });

        let newItem = {
          name: "Resuelto",
          value: completedCount.count,
          label: "Resuelto"
        };
        processedData.push(newItem);
      }
    }
    return processedData;
};

const GetTicketsByAgents = (res: any) => {

  let processedData: any = [], responseItems: any = [];
  const iteratorArray = [TicketsByType.agentUnstarted, TicketsByType.agentSolved, TicketsByType.agentProcessing];  
  iteratorArray.forEach((val: any)=> {
    if (!isEmpty(res[val])) {
      let temp: any = [];
      res[val].forEach((item: any)=> {
          if (item[0] !== 'undefined') {
            temp[item[0]] = item[1];
          }
      });
      responseItems[val] = temp;
    }
  });

  const unstartedItems = res[TicketsByType.agentUnstarted];
  const progressingItems = res[TicketsByType.agentProcessing];
  const solvedItems = res[TicketsByType.agentSolved];

  const unstarted = (unstartedItems && unstartedItems[1]) ? keyBy(GetCountFromRes(unstartedItems, unstartedItems[1].length), (o)=> o.name) : [];
  const progressing = (progressingItems && progressingItems[1]) ? keyBy(GetCountFromRes(progressingItems, progressingItems[1].length), (o)=> o.name) : [];
  const solved  = (solvedItems && solvedItems[1]) ? keyBy(GetCountFromRes(solvedItems, solvedItems[1].length), (o)=> o.name) : [];

  const allUniqueAgents = uniq([ ...Object.keys(unstarted), ...Object.keys(progressing), ...Object.keys(solved)]);

  if (!isEmpty(allUniqueAgents)) {
      allUniqueAgents.forEach((categoryName: string, index: number) => {
        if (index < showItems) {
          if (categoryName !== "undefined") {
            let agentData: any = {};
            agentData['name'] = categoryName;
            agentData['series'] = [
              {
                "name": Statuses.status_unstarted,
                "value": (unstarted && unstarted[categoryName]) ? unstarted[categoryName].value : 0
              },
              {
                "name": Statuses.status_in_progress,
                "value": (progressing && progressing[categoryName]) ? progressing[categoryName].value : 0
              },
              {
                "name": "Solved",
                "value": (solved && solved[categoryName]) ? solved[categoryName].value : 0
              }
            ];
            processedData.push(agentData);
          }
        }
      });
  }

  return processedData;
}

const GetTicketsReponseTime = (data: TicketResponseTime[], type: string) => {
  let series:any = [], bubbleData : any[] = [], sortedData:any = [], hoursArray: number[] = [], minMaxAvg: any = {};
  if (!isEmpty(data)) {
    series = data.map((record: any) => {
      record = record[1];
      let count = 0;
      if (record.count > 0) {
        hoursArray.push(record.count);
        const days = Math.floor(record.count / 24);
        count = days;
      }
      return { name: record.category, x: count, y: '', r: count};
    });

    hoursArray = hoursArray.sort();
    const hoursArrLen = hoursArray.length;
    if (hoursArray && hoursArrLen > 0) {
      const sum = hoursArray.reduce((acc,ind) => {
          return acc = acc + ind;
      });
      minMaxAvg = {
        min: Math.floor(hoursArray[0] / 24),
        max: Math.floor(hoursArray[hoursArrLen - 1] / 24), 
        avg: Math.floor((sum / hoursArrLen) / 24)
      };
    }
  }
  if (series && series.length > 0) {
    bubbleData  = [
      {
        name: type,
        series: series
      }
    ];
  }
  
  return { data: bubbleData, dataRange: minMaxAvg };
}

const weeksBetween = (d1: any, d2: any): any => {
    let start = new Date(d1);
    let end = new Date(d2);
    let sDate;
    let eDate;
    let dateArr = [];

    while(start <= end){
      if (start.getDay() == 1 || (dateArr.length == 0 && !sDate)){
        sDate = new Date(start.getTime());
      }

      if ((sDate && start.getDay() == 0) || start.getTime() == end.getTime()){
            eDate = new Date(start.getTime());
      }

      if(sDate && eDate){
        dateArr.push({'startDate': FormatDate(sDate), 'endDate': FormatDate(eDate)});
        sDate = undefined;
        eDate = undefined;
      }

        start.setDate(start.getDate() + 1);
    }
    return dateArr;
}

const GetTotalCount = (dataSet: any, category: string) => {
  let temp = dataSet.map((itemVal: any) => {
              return uniqBy(itemVal[1], 'category');
            });

    temp = flatten(temp);
    let sortedPublished = orderBy(temp, ['count'], ['desc']); 
    sortedPublished = sortedPublished.filter((it: any) => it.category == category);
    return (sortedPublished && sortedPublished.length > 0) ? sortedPublished[0].count : 0;
}

const GetTicketsByFolder = (dataSet: any) => {
  let folders: any = [];
   if (!isEmpty(dataSet)) {
     dataSet.forEach((item: any) => {
       if (!isEmpty(item[1])) {
         item[1].forEach((cat : any) => {
           let temp = {
              name: FormatDate(item[0], "MM/DD"),
              value: cat.count
            }
            const folderName = cat.category;
            if (isEmpty(folders[folderName])) {
              folders[folderName] = [temp];
            } else {
              folders[folderName] = [...folders[folderName], temp];
            }
         });
       }
     });

     if (Array.isArray(folders)) {
       let parseData: any = [];
       Object.entries(folders).forEach(([k,v]) => {
          let temp = {
              name: k,
              series: v
            }
          parseData.push(temp);
       });
      return parseData;       
     }
  }
  return []; 
}
  

const GetTicketsByWeek = (res: any, dates: any) => {
  const statuses = res[TicketsByType.status];
  let unstartedStatuses: StatusFormat[] = [], publishedStatuses:StatusFormat[] = [], inprogressStatuses: StatusFormat[] = [];
  const startDate = new Date(dates.startDate);
  const endDate = new Date(dates.endDate);
  const weekData = weeksBetween(startDate, endDate);
  if (!isEmpty(statuses)) {

    if (weekData.length > 0) {

      weekData.forEach((range: any) => {
        let ticketsByStatus = statuses.filter((item: any) => {
          const date = new Date(item[0]).getTime();
          const startDateTime = new Date(range.startDate).getTime();
          const endDateTime   = new Date(range.endDate).getTime();
          return date >= startDateTime && date <= endDateTime;
        });

        if (!isEmpty(ticketsByStatus)) {
            const unstartedCount = GetTotalCount(ticketsByStatus, Statuses.status_unstarted);
            const precheckedCount = GetTotalCount(ticketsByStatus, Statuses.status_pre_checked);
            let temp = {
              name: FormatDate(range.startDate, "MM/DD"),
              value: unstartedCount + precheckedCount
            }
            unstartedStatuses.push(temp);
        }

        if (!isEmpty(ticketsByStatus)) {
          const inprogressCount = GetTotalCount(ticketsByStatus, Statuses.status_in_progress);
            let temp = {
              name: FormatDate(range.startDate, "MM/DD"),
              value: inprogressCount
            }
            inprogressStatuses.push(temp);          
        }

        let completedCount = 0;
        if (!isEmpty(ticketsByStatus)) {
            [Statuses.status_false, Statuses.status_true, Statuses.status_out_of_scope, Statuses.status_partly_false, Statuses.status_inconclusive, Statuses.status_misleading].forEach((status) => {
              completedCount += GetTotalCount(ticketsByStatus, status);
            });
        }

        if (completedCount > 0) {
          let temp = {
            name: FormatDate(range.startDate, "MM/DD"),
            value: completedCount
          }
          publishedStatuses.push(temp);
        }
      });
    }
  }

  if (unstartedStatuses.length > 0 || inprogressStatuses.length > 0 || publishedStatuses.length > 0) {
    const finalStatusesByWeek = [
          {
            name: Statuses.status_unstarted,
            series: unstartedStatuses
          },
          {
            name: Statuses.status_in_progress,
            series: inprogressStatuses
          },
          {
            name: 'Resuelto',
            series: publishedStatuses
          }   
    ]
    return finalStatusesByWeek;
  }
  return null; 
}

const daysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
}

const GetPreviousWeekFirstDay = ()=> {
  let today = new Date();
  return new Date().setDate(today.getDate()-today.getDay()-6);
}

const GetFirstLastDayMonth = () => {
  const date = new Date();
  return {
    firstDay: new Date(date.getFullYear(), date.getMonth(), 1),
    lastDay: new Date(date.getFullYear(), date.getMonth(), daysInMonth(date.getMonth()+1, date.getFullYear()))
  }
}

export const DashboardHelpers = {
  FormatDate,
  SortStatistics,
  GetTicketsByChannel,
  GetTicketsByTag,
  GetTicketsByCurrentStatus,
  GetTicketsByAgents,
  GetFirstLastDayMonth,
  GetTicketsByWeek,
  GetPreviousWeekFirstDay,
  GetTicketsByType,
  GetTicketsReponseTime,
  GetTicketsByFolder,
  GetCountFromRes
};