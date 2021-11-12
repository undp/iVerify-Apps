import * as moment from 'moment';
import { isEmpty, orderBy, uniqBy, flatten } from 'lodash';
import { TicketsByType, TicketCatResFormat, StatusFormatPieChart, StatusFormat } from '../models/dashboard';

const showItems = 5;

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

const GetTicketsByTag = (res: any[]) => {
  let processedData: any = [];
  if (!isEmpty(res)) {
    const len = res.length;
    // const data = flatten(res);

    let newArr = res.map((itemVal: any) => {
        let temp = itemVal[1].filter((item: any) => (item.count !== 0));
        return temp;
      });

    newArr = flatten(newArr);
    let sortData = orderBy(newArr, ['count'], ['desc']); 
    sortData.forEach((value: TicketCatResFormat, index: number) => {
      if (!isEmpty(value.category) && index < showItems) {
        const category = {
          name: value.category,
          value: value.count
        };
        processedData.push(category);
      }
    });

    // let sortData = res[len - 1][1]; // orderBy(res[len - 1][1], ['count'], ['desc']);    
    // sortData = sortData.filter((item: any) => item.count !== 0);
    // sortData.forEach((value: TicketCatResFormat, index: number) => {
    //   if (!isEmpty(value.category) && index < showItems) {
    //     const category = {
    //       name: value.category,
    //       value: value.count
    //     };
    //     processedData.push(category);
    //   }
    // });
  }
  return processedData;
};

const GetTicketsByCurrentStatus = (res: any) => {
    let processedData: StatusFormatPieChart[] = [];
    if (!isEmpty(res)) {
      const statuses = res.status;

      let newArr = statuses.map((itemVal: any) => {
        let temp = itemVal[1].filter((item: any) => (item.category === 'Unstarted' || item.category === 'In Progress'));
        temp = uniqBy(temp, 'category');
        return temp;
      });
      newArr = flatten(newArr);
      let sortData = orderBy(newArr, ['count'], ['desc']); 

      const unstarted = sortData.filter((it: any) => it.category === 'Unstarted');
      const inprogress = sortData.filter((it: any) => it.category !== 'Unstarted');

      const waintingCount = unstarted.reduce((acc, val) => {
          acc = acc + val.count;          
          return acc;
      }, 0);

      const inprogressCount = inprogress.reduce((acc, val) => {
          acc = acc + val.count;          
          return acc;
      }, 0);

      processedData.push(
        {
          name: unstarted[0].category,
          value: waintingCount,
          label: 'Waiting'
        }, {
          name: inprogress[0].category,
          value: inprogressCount,
          label: 'Started'
        }
      );              

      const publishedItems = res.createdVsPublished;
      if (!isEmpty(publishedItems)) {

        let publishedData = publishedItems.map((itemVal: any) => {
          return uniqBy(itemVal[1], 'category');
        });

        publishedData = flatten(publishedData);
        let sortedPublished = orderBy(publishedData, ['count'], ['desc']); 
        sortedPublished = sortedPublished.filter((it: any) => it.category === 'published');
        const publishedCount = sortedPublished.reduce((acc, val) => {
          acc = acc + val.count;          
          return acc;
      }, 0);

        let newItem = {
          name: sortedPublished[0].category,
          value: publishedCount,
          label: 'Completed'
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
      let temp: any = {};
      res[val].forEach((item: any)=> {
          if (item[0] !== 'undefined') {
            temp[item[0]] = item[1];
          }
      });
      responseItems[val] = temp;
    }
  });
  const unstarted = responseItems[TicketsByType.agentUnstarted];
  const progressing = responseItems[TicketsByType.agentProcessing];
  const solved  = responseItems[TicketsByType.agentSolved];
  if (!isEmpty(unstarted)) {
      Object.keys(unstarted).forEach((categoryName: string, index: number) => {
        if (index < showItems) {
          let agentData: any = {};
            agentData['name'] = categoryName;
            agentData['series'] = [
              {
                "name": "Unstarted",
                "value": (unstarted && unstarted[categoryName]) ? unstarted[categoryName] : 0
              },
              {
                "name": "Started",
                "value": (progressing && progressing[categoryName]) ? progressing[categoryName] : 0
              },
              {
                "name": "Solved",
                "value": (solved && solved[categoryName]) ? solved[categoryName] : 0
              }
            ];
            processedData.push(agentData);
          }
      });
  }

  return processedData;
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
    sortedPublished = sortedPublished.filter((it: any) => it.category.toLowerCase() === category);
    const publishedCount = sortedPublished.reduce((acc, val) => {
        acc = acc + val.count;          
        return acc;
    }, 0);

    return publishedCount;
}

const GetTicketsByWeek = (res: any, dates: any) => {
  const statuses = res[TicketsByType.status];
  const published = res[TicketsByType.createdVsPublished];
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
          return date > startDateTime && date < endDateTime;
        });

        if (!isEmpty(ticketsByStatus)) {
            const unstartedCount = GetTotalCount(ticketsByStatus, 'unstarted');
            let temp = {
              name: FormatDate(ticketsByStatus[0][0], "MM/DD"),
              value: unstartedCount
            }
            unstartedStatuses.push(temp);
        }

        if(!isEmpty(ticketsByStatus)) {
          const inprogressCount = GetTotalCount(ticketsByStatus, 'in progress');
            let temp = {
              name: FormatDate(ticketsByStatus[0][0], "MM/DD"),
              value: inprogressCount
            }
            inprogressStatuses.push(temp);          
        }

        let publishedTicketsWeek = published.filter((item: any) => {
          const date = new Date(item[0]).getTime();
          const startDateTime = new Date(range.startDate).getTime();
          const endDateTime   = new Date(range.endDate).getTime();
          return date >= startDateTime && date <= endDateTime;
        });

        if (!isEmpty(publishedTicketsWeek)) {

            // let temp = publishedTicketsWeek.map((itemVal: any) => {
            //   return uniqBy(itemVal[1], 'category');
            // });

            // temp = flatten(temp);
            // let sortedPublished = orderBy(temp, ['count'], ['desc']); 
            // sortedPublished = sortedPublished.filter((it: any) => it.category === 'published');
            // const publishedCount = sortedPublished.reduce((acc, val) => {
            //     acc = acc + val.count;          
            //     return acc;
            // }, 0);

          const completedCount = GetTotalCount(publishedTicketsWeek, 'published');
          if (completedCount > 0) {
            let temp = {
              name: FormatDate(publishedTicketsWeek[0][0], "MM/DD"),
              value: completedCount
            }
            publishedStatuses.push(temp);
          }
        }
      });
      
    }
  }

  if (unstartedStatuses.length > 0 || inprogressStatuses.length > 0 || publishedStatuses.length > 0) {
    const finalStatusesByWeek = [
          {
            name: 'Unstarted',
            series: unstartedStatuses
          },
          {
            name: 'Inprogress',
            series: inprogressStatuses
          },
          {
            name: 'Completed',
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
  GetTicketsByType
};