import { CountBy } from "./count-by.enum";

export interface StatsResults{
    range: {
        startDate: string,
        endDate: string
    },
    results: {
        [key in CountBy]?: {
            category: string,
            count: number
        }
    }
}

// example:

// {
//     "range": {
//       "startDate": "2021-4-1",
//       "endDate": "2021-6-9"
//     },
//     "results": {
//       "tag": [
//         {
//           "category": "Result management",
//           "count": 0
//         },
//         {
//           "category": "Electoral Campaign",
//           "count": 0
//         },
//         {
//           "category": "Ballot counting",
//           "count": 0
//         },
//         {
//           "category": "presidential elections 2021",
//           "count": 0
//         },
//         {
//           "category": "Elections 2021",
//           "count": 1
//         },
//         {
//           "category": "Voter registration",
//           "count": 0
//         },
//         {
//           "category": "French politics",
//           "count": 1
//         },
//         {
//           "category": "Covid-19",
//           "count": 2
//         },
//         {
//           "category": "URGENT",
//           "count": 0
//         }
//       ],
//       "status": [
//         {
//           "category": "Unstarted",
//           "count": 94
//         },
//         {
//           "category": "In Progress",
//           "count": 0
//         },
//         {
//           "category": "False",
//           "count": 2
//         },
//         {
//           "category": "True",
//           "count": 3
//         },
//         {
//           "category": "Misleading",
//           "count": 0
//         },
//         {
//           "category": "Out of scope",
//           "count": 1
//         },
//         {
//           "category": "Partly false",
//           "count": 0
//         },
//         {
//           "category": "Inconclusive",
//           "count": 0
//         },
//         {
//           "category": "Pre-checked",
//           "count": 0
//         }
//       ],
//       "createdVsPublished": [
//         {
//           "category": "published",
//           "count": 3
//         },
//         {
//           "category": "unpublished",
//           "count": 85
//         }
//       ]
//     }
//   }
//   Response headers
  