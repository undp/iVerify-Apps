import * as moment from 'moment';
import { isEmpty, orderBy } from 'lodash';
import { TicketCatResFormat } from '../models/dashboard';

const showItems = 5;

interface statusFormat {
    name: string,
    value: number;
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
    const sortData = orderBy(res[0][1], ['count'], ['desc']);    
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

const GetTicketsByCurrentStatus = (res: any[]) => {
    let processedData: any = [];
    if (!isEmpty(res)) {
      const currentStatuses = res.filter(item => (item.name === 'Unstarted' || item.name === 'In Progress'));
      processedData = currentStatuses.map((item) => {
          let newItem = {
            name: '',
            value: '',
            label: ''
          };
          newItem['name'] = item.name;
          newItem['value'] = item.value;
          newItem['label'] = (item.name === 'Unstarted') ? 'Waiting' : 'Started';
          return newItem;
      });
    }
    return processedData;
};

const GetTicketsByAgents = (res: any) => {

  let processedData: any = [], responseItems: any = [];
  const iteratorArray = ['agentUnstarted', 'agentSolved', 'agentProsessing'];  
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

  if (!isEmpty(responseItems['agentUnstarted'])) {
      Object.keys(responseItems['agentUnstarted']).forEach((categoryName: string, index: number) => {
        if (index < showItems) {
          let agentData: any = {};
            agentData['name'] = categoryName;
            agentData['series'] = [
              {
                "name": "Unstarted",
                "value": (responseItems['agentUnstarted'] && responseItems['agentUnstarted'][categoryName]) ? responseItems['agentUnstarted'][categoryName] : 0
              },
              {
                "name": "Started",
                "value": (responseItems['agentProsessing'] && responseItems['agentProsessing'][categoryName]) ? responseItems['agentProsessing'][categoryName] : 0
              },
              {
                "name": "Solved",
                "value": (responseItems['agentSolved'] && responseItems['agentSolved'][categoryName]) ? responseItems['agentSolved'][categoryName] : 0
              }
            ];
            processedData.push(agentData);
          }
      });
  }

  return processedData;
}

const GetTicketsByWeek = (res: any) => {
  const statuses = res['status'];
  const published = res['createdVsPublished'];
  let unstartedStatuses: statusFormat[] = [], publishedStatuses:statusFormat[] = [], inprogressStatuses: statusFormat[] = [];
  if (!isEmpty(statuses)) {

    const ticketStatusByDay = Object.keys(statuses);

    if (ticketStatusByDay.length > 0) {

      ticketStatusByDay.forEach((key) => {

        if(!isEmpty(statuses[key])) {
          let dayData = statuses[key];
          let unstarted = dayData.filter((item: any) => (item.category === 'Unstarted'));
          let temp = {
            name: key,
            value: unstarted[0].count
          }
          unstartedStatuses.push(temp);
        }

        if(!isEmpty(statuses[key])) {
          let dayData = statuses[key];
          let inprogress = dayData.filter((item: any) => (item.category === 'In Progress'));
          let temp = {
            name: key,
            value: inprogress[0].count
          }
          inprogressStatuses.push(temp);
        }

        if (!isEmpty(published[key])) {
          let dayData = published[key];
          let publishedCreated = dayData.filter((item: any) => (item.category === 'published'));
          let temp = {
            name: key,
            value: publishedCreated[0].count
          }
          publishedStatuses.push(temp);
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
  GetTicketsByWeek
};