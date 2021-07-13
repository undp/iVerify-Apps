import * as moment from 'moment';

const FormatDate = (date: Date, format: string = 'YYYY-MM-DD') => {
  return moment(date).format(format);
}

export const DashboardHelpers = {
  FormatDate
};