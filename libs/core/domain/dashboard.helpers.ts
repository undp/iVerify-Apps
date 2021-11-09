import * as moment from 'moment';
import { isEmpty, orderBy, uniqBy } from 'lodash';
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
    let sortData = orderBy(res[0][1], ['count'], ['desc']);    
    sortData = sortData.filter(item => item.category !== 'Unstarted' && item.category !== 'In Progress');
    sortData.forEach((value: TicketCatResFormat, index: number) => {
      if (!isEmpty(value.category) && index < showItems) {
        const category = {
          name: value.category,
          value: value.count
        };
        processedData.push(category);
      }
    });
  }
  return processedData;
};

const GetTicketsByCurrentStatus = (res: any) => {
    let processedData: StatusFormatPieChart[] = [];
    if (!isEmpty(res)) {
      const statuses = res.status;
      const latestDateIndex = statuses.length - 1;
      let sortData = orderBy(statuses[latestDateIndex][1], ['count'], ['desc']); 
      if (sortData.length > 0 ) {
        let currentStatuses = sortData.filter(item => (item.category === 'Unstarted' || item.category === 'In Progress'));
        currentStatuses = uniqBy(currentStatuses, 'category');
        processedData = currentStatuses.map((item) => {
            let newItem = {
              name: item.category,
              value: item.count,
              label: (item.category === 'Unstarted') ? 'Waiting' : 'Started'
            };              
            return newItem;
        });
      }

      const publishedItems = res.createdVsPublished;
      const latestDatePubInd = publishedItems.length - 1;
      let newItem = {
        name: publishedItems[latestDatePubInd][1][0].category,
        value: publishedItems[latestDatePubInd][1][0].count,
        label: 'Completed'
      };
      processedData.push(newItem);
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

const GetTicketsByWeek = (res: any) => {
  const statuses = res[TicketsByType.status];
  const published = res[TicketsByType.createdVsPublished];
  let unstartedStatuses: StatusFormat[] = [], publishedStatuses:StatusFormat[] = [], inprogressStatuses: StatusFormat[] = [];
  if (!isEmpty(statuses)) {

    const ticketStatusByDay = Object.keys(statuses);

    if (ticketStatusByDay.length > 0) {

      ticketStatusByDay.forEach((key) => {

        if(!isEmpty(statuses[key])) {
          let dayData = statuses[key];
          let unstarted = dayData.filter((item: any) => (item.category === 'Unstarted'));
          if (unstarted.length > 0) {
            let temp = {
              name: moment(key).format('DD/MM'),
              value: unstarted[0].count
            }
            unstartedStatuses.push(temp);
          }
        }

        if(!isEmpty(statuses[key])) {
          let dayData = statuses[key];
          let inprogress = dayData.filter((item: any) => (item.category === 'In Progress'));
          if (inprogress.length > 0) {
            let temp = {
              name: moment(key).format('DD/MM'),
              value: inprogress[0].count
            }
            inprogressStatuses.push(temp);
          }
        }

        if (!isEmpty(published[key])) {
          let dayData = published[key];
          let publishedCreated = dayData.filter((item: any) => (item.category === 'published'));
          if (publishedCreated.length > 0) {
              let temp = {
                name: moment(key).format('DD/MM'),
                value: publishedCreated[0].count
              }
              publishedStatuses.push(temp);
          }
        }
      });
      
    }
  }
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