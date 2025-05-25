// import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { ChartData, ChartOptions } from 'chart.js';
// import { MatTableDataSource } from '@angular/material/table';
// import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatDividerModule } from '@angular/material/divider';
// import { Notyf } from 'notyf';
// import { MatTableModule } from '@angular/material/table';
// import { MatCardModule } from '@angular/material/card';
// import { SystemStatisticsDto, UserGrowth, UserStatisticsDto } from '../../Models/UserGrowth';
// import { UsersService } from '../../Services/Auth/Users/users.service';
// import { StatisticsService } from '../../Services/Statistics/statistics.service';
// import { LessonService } from '../../Services/Lesson/lesson.service';
// import { Lesson } from '../../Models/Lesson';
// import { forkJoin } from 'rxjs';

// @Component({
//   selector: 'app-user-statistics',
//   standalone: true,
//   imports: [MatTableModule, MatCardModule, NgChartsModule, MatPaginator, MatDividerModule],
//   templateUrl: './user-statistics.component.html',
//   styleUrls: ['./user-statistics.component.css']
// })
// export class UserStatisticsComponent implements OnInit, AfterViewInit {
//   public userGrowthData: UserGrowth[] = [];
//   public chartData: ChartData<'line'> = {
//     labels: [],
//     datasets: [
//       {
//         label: 'גידול משתמשים',
//         data: [],
//         fill: true,
//         borderColor: '#12977b',
//         backgroundColor: 'rgba(18, 151, 123, 0.2)',
//         tension: 0.3
//       }
//     ]
//   };
  
//   private notyf = new Notyf({
//     duration: 40000,
//     position: { x: 'center', y: 'top' },
//     dismissible: true 
//   });
  
//   public chartOptions: ChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(18, 151, 123, 0.1)'
//         },
//         ticks: {
//           color: '#333333'
//         },
//         title: { 
//           display: true, 
//           text: 'מספר משתמשים',
//           color: '#12977b',
//           font: {
//             weight: 'bold'
//           }
//         }
//       },
//       x: {
//         grid: {
//           color: 'rgba(18, 151, 123, 0.1)'
//         },
//         ticks: {
//           color: '#333333'
//         },
//         title: { 
//           display: true, 
//           text: 'חודש/שנה',
//           color: '#12977b',
//           font: {
//             weight: 'bold'
//           }
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         labels: {
//           color: '#333333',
//           font: {
//             weight: 'bold'
//           }
//         }
//       }
//     }
//   };

//   public systemBarChartData: ChartData<'bar'> = {
//     labels: ['סטטיסטיקות מערכת'],
//     datasets: [
//       {
//         label: 'משתמשים',
//         data: [],
//         backgroundColor: '#12977b'
//       },
//       {
//         label: 'תיקיות',
//         data: [],
//         backgroundColor: '#16b592'
//       },
//       {
//         label: 'קבצים',
//         data: [],
//         backgroundColor: '#0e7961'
//       }
//     ]
//   };

//   public systemBarChartOptions: ChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(18, 151, 123, 0.1)'
//         },
//         ticks: {
//           color: '#333333'
//         }
//       },
//       x: {
//         grid: {
//           display: false
//         },
//         ticks: {
//           color: '#333333'
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         display: true, 
//         position: 'top',
//         labels: {
//           color: '#333333',
//           font: {
//             weight: 'bold'
//           }
//         }
//       }
//     }
//   };

//   // גרף עוגה לשיעורים עם/בלי תמלול
//   public lessonPieChartData: ChartData<'pie'> = {
//     labels: ['שיעורים עם תמלול', 'שיעורים ללא תמלול'],
//     datasets: [
//       {
//         data: [],
//         backgroundColor: [
//           '#12977b',  // תכלת עבור שיעורים עם תמלול
//           '#0e7961'   // תכלת כהה עבור שיעורים ללא תמלול
//         ],
//         hoverBackgroundColor: [
//           '#16b592',
//           '#16b592'
//         ],
//         borderWidth: 2,
//         borderColor: '#ffffff'
//       }
//     ]
//   };

//   public lessonPieChartOptions: ChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { 
//         display: true,
//         position: 'top',
//         labels: {
//           color: '#333333',
//           font: {
//             size: 14,
//             weight: 'bold'
//           },
//           padding: 20
//         }
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             const label = context.label || '';
//             const value = context.raw;
//             const total = context.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
//             const percentage = Math.round((value as number * 100) / total);
//             return `${label}: ${value} (${percentage}%)`;
//           }
//         }
//       }
//     },
//     layout: {
//       padding: 20
//     }
//   };

//   public systemStatistics: SystemStatisticsDto = {
//     totalUsers: 0,
//     totalFolders: 0,
//     totalFiles: 0
//   };

//   displayedColumns: string[] = ['username', 'albumCount', 'fileCount'];
//   dataSource!: MatTableDataSource<UserStatisticsDto>;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   @ViewChild('systemBarChart') systemBarChart!: BaseChartDirective;
//   @ViewChild('userGrowthChart') userGrowthChart!: BaseChartDirective;
//   @ViewChild('lessonPieChart') lessonPieChart!: BaseChartDirective;

//   constructor(
//     private userService: UsersService,
//     private statisticsService: StatisticsService,
//     private lessonService: LessonService,
//     private cdr: ChangeDetectorRef
//   ) { }

//   ngOnInit(): void {
//     this.loadUserGrowthData();
//     this.loadUserStatistics();
//     this.loadSystemStatistics();
//     this.loadLessonStatistics();
//   }
  
//   ngAfterViewInit(): void {
//     // וידוא שהגרפים מאותחלים כראוי לאחר שהתצוגה מוכנה
//     this.cdr.detectChanges();
//   }

//   loadUserGrowthData(): void {
//     this.statisticsService.getUserGrowthData().subscribe({
//       next: (data: UserGrowth[]) => {
//         this.userGrowthData = data;
//         this.prepareChartData();
//         this.cdr.detectChanges();
        
//         // הוספת השהייה קצרה כדי להבטיח שהעדכון מתרחש לאחר זיהוי השינויים
//         setTimeout(() => {
//           console.log('userGrowthChart:', this.userGrowthChart); // שורת דיבאג
//           this.userGrowthChart?.update();
//         }, 0);
//       },
//       error: (error) => {
//         this.notyf.error(`שגיאה בטעינת נתוני גידול משתמשים: '${error.error}'`);
//         console.error('שגיאה בטעינת נתוני גידול משתמשים:', error);
//       }
//     });
//   }

//   prepareChartData(): void {
//     const labels: string[] = [];
//     const userCounts: number[] = [];

//     this.userGrowthData.forEach((item: UserGrowth) => {
//       const label = `${item.month}/${item.year}`;
//       labels.push(label);
//       userCounts.push(item.userCount);
//     });

//     this.chartData = {
//       ...this.chartData,
//       labels,
//       datasets: [{ 
//         ...this.chartData.datasets[0], 
//         data: userCounts,
//         borderColor: '#12977b',
//         backgroundColor: 'rgba(18, 151, 123, 0.2)'
//       }]
//     };
//   }

//   loadUserStatistics(): void {
//     this.statisticsService.getUserStatistics().subscribe({
//       next: (response: UserStatisticsDto[]) => {
//         this.dataSource = new MatTableDataSource(response);
//         setTimeout(() => this.dataSource.paginator = this.paginator);
//       },
//       error: (error) => {
//         this.notyf.error(`שגיאה בטעינת סטטיסטיקות משתמשים: ${error.message}`);
//         console.error('שגיאה בטעינת סטטיסטיקות משתמשים:', error);
//       }
//     });
//   }

//   loadSystemStatistics(): void {
//     this.statisticsService.getSystemStatistics().subscribe({
//       next: (response: SystemStatisticsDto) => {
//         this.systemStatistics = response;

//         // עדכון נתוני הגרף עם הצבעים החדשים
//         this.systemBarChartData = {
//           labels: ['סטטיסטיקות מערכת'],
//           datasets: [
//             {
//               label: 'משתמשים',
//               data: [this.systemStatistics.totalUsers],
//               backgroundColor: '#12977b'
//             },
//             {
//               label: 'תיקיות',
//               data: [this.systemStatistics.totalFolders],
//               backgroundColor: '#16b592'
//             },
//             {
//               label: 'קבצים',
//               data: [this.systemStatistics.totalFiles],
//               backgroundColor: '#0e7961'
//             }
//           ]
//         };

//         setTimeout(() => {
//           this.cdr.detectChanges();
//           this.systemBarChart?.update();
//         });
//       },
//       error: (error) => {
//         this.notyf.error(`שגיאה בטעינת סטטיסטיקות מערכת: ${error.message}`);
//         console.error('שגיאה בטעינת סטטיסטיקות מערכת:', error);
//       }
//     });
//   }

//   loadLessonStatistics(): void {
//     // שימוש ב-forkJoin כדי לבצע בקשות מקבילות לשני סוגי שיעורים
//     forkJoin({
//       withTranscript: this.lessonService.getLessonsWithTranscript(),
//       withoutTranscript: this.lessonService.getLessonsWithoutTranscript()
//     }).subscribe({
//       next: (result) => {
//         const withTranscriptCount = result.withTranscript.length;
//         const withoutTranscriptCount = result.withoutTranscript.length;
        
//         // עדכון נתוני גרף העוגה
//         this.lessonPieChartData = {
//           ...this.lessonPieChartData,
//           datasets: [
//             {
//               ...this.lessonPieChartData.datasets[0],
//               data: [
//                 withTranscriptCount,
//                 withoutTranscriptCount
//               ],
//               backgroundColor: [
//                 '#12977b',  // תכלת עבור שיעורים עם תמלול
//                 '#0e7961'   // תכלת כהה עבור שיעורים ללא תמלול
//               ],
//               hoverBackgroundColor: [
//                 '#16b592',
//                 '#16b592'
//               ]
//             }
//           ]
//         };
        
//         // אכיפת רינדור מיידי בעדיפות גבוהה
//         Promise.resolve().then(() => {
//           this.cdr.detectChanges();
//           if (this.lessonPieChart) {
//             this.lessonPieChart.update();
//             console.log('גרף העוגה עודכן מיד');
//           } else {
//             // אם הפניית הגרף אינה זמינה עדיין, ניסיון חוזר עם השהייה קצרה
//             setTimeout(() => {
//               this.cdr.detectChanges();
//               if (this.lessonPieChart) {
//                 this.lessonPieChart.update();
//                 console.log('גרף העוגה עודכן לאחר השהייה');
//               }
//             }, 50);
//           }
//         });
//       },
//       error: (error) => {
//         this.notyf.error(`שגיאה בטעינת סטטיסטיקות שיעורים: ${error.message}`);
//         console.error('שגיאה בטעינת סטטיסטיקות שיעורים:', error);
//       }
//     });
//   }
// }

import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { MatPaginator } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { Notyf } from 'notyf';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { SystemStatisticsDto, UserGrowth, UserStatisticsDto } from '../../Models/UserGrowth';
import { UsersService } from '../../Services/Auth/Users/users.service';
import { StatisticsService } from '../../Services/Statistics/statistics.service';
import { LessonService } from '../../Services/Lesson/lesson.service';
import { Lesson } from '../../Models/Lesson';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-statistics',
  standalone: true,
  imports: [MatTableModule, MatCardModule, NgChartsModule, MatPaginator, MatDividerModule],
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit, AfterViewInit {
  public userGrowthData: UserGrowth[] = [];
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'גידול משתמשים',
        data: [],
        fill: true,
        borderColor: '#12977b',
        backgroundColor: 'rgba(18, 151, 123, 0.2)',
        tension: 0.3
      }
    ]
  };
  
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true 
  });
  
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(18, 151, 123, 0.1)'
        },
        ticks: {
          color: '#333333'
        },
        title: { 
          display: true, 
          text: 'מספר משתמשים',
          color: '#12977b',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(18, 151, 123, 0.1)'
        },
        ticks: {
          color: '#333333'
        },
        title: { 
          display: true, 
          text: 'חודש/שנה',
          color: '#12977b',
          font: {
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#333333',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  public systemBarChartData: ChartData<'bar'> = {
    labels: ['סטטיסטיקות מערכת'],
    datasets: [
      {
        label: 'משתמשים',
        data: [],
        backgroundColor: '#12977b'
      },
      {
        label: 'תיקיות',
        data: [],
        backgroundColor: '#16b592'
      },
      {
        label: 'קבצים',
        data: [],
        backgroundColor: '#0e7961'
      }
    ]
  };

  public systemBarChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(18, 151, 123, 0.1)'
        },
        ticks: {
          color: '#333333'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#333333'
        }
      }
    },
    plugins: {
      legend: {
        display: true, 
        position: 'top',
        labels: {
          color: '#333333',
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  // גרף עוגה לשיעורים עם/בלי תמלול וסך הכל
  public lessonPieChartData: ChartData<'pie'> = {
    labels: ['שיעורים עם תמלול', 'שיעורים ללא תמלול', 'סך כל השיעורים'],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#12977b',  // תכלת עבור שיעורים עם תמלול
          '#0e7961',   // תכלת כהה עבור שיעורים ללא תמלול
          '#333333'    // שחור עבור סך הכל שיעורים
        ],
        hoverBackgroundColor: [
          '#16b592',
          '#16b592',
          '#666666'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  public lessonPieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'right',  // הזזת המקרא לצד ימין
        labels: {
          color: '#333333',
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0) / 2; // מחלקים ב-2 כי סך הכל הוא כפול
            const percentage = Math.round((value as number * 100) / total);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    layout: {
      padding: 20
    }
  };

  public systemStatistics: SystemStatisticsDto = {
    totalUsers: 0,
    totalFolders: 0,
    totalFiles: 0
  };

  displayedColumns: string[] = ['username', 'albumCount', 'fileCount'];
  dataSource!: MatTableDataSource<UserStatisticsDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('systemBarChart') systemBarChart!: BaseChartDirective;
  @ViewChild('userGrowthChart') userGrowthChart!: BaseChartDirective;
  @ViewChild('lessonPieChart') lessonPieChart!: BaseChartDirective;

  constructor(
    private userService: UsersService,
    private statisticsService: StatisticsService,
    private lessonService: LessonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUserGrowthData();
    this.loadUserStatistics();
    this.loadSystemStatistics();
    this.loadLessonStatistics();
  }
  
  ngAfterViewInit(): void {
    // וידוא שהגרפים מאותחלים כראוי לאחר שהתצוגה מוכנה
    this.cdr.detectChanges();
  }

  loadUserGrowthData(): void {
    this.statisticsService.getUserGrowthData().subscribe({
      next: (data: UserGrowth[]) => {
        this.userGrowthData = data;
        this.prepareChartData();
        this.cdr.detectChanges();
        
        // הוספת השהייה קצרה כדי להבטיח שהעדכון מתרחש לאחר זיהוי השינויים
        setTimeout(() => {
          console.log('userGrowthChart:', this.userGrowthChart); // שורת דיבאג
          this.userGrowthChart?.update();
        }, 0);
      },
      error: (error) => {
        this.notyf.error(`שגיאה בטעינת נתוני גידול משתמשים: '${error.error}'`);
        console.error('שגיאה בטעינת נתוני גידול משתמשים:', error);
      }
    });
  }

  prepareChartData(): void {
    const labels: string[] = [];
    const userCounts: number[] = [];

    this.userGrowthData.forEach((item: UserGrowth) => {
      const label = `${item.month}/${item.year}`;
      labels.push(label);
      userCounts.push(item.userCount);
    });

    this.chartData = {
      ...this.chartData,
      labels,
      datasets: [{ 
        ...this.chartData.datasets[0], 
        data: userCounts,
        borderColor: '#12977b',
        backgroundColor: 'rgba(18, 151, 123, 0.2)'
      }]
    };
  }

  loadUserStatistics(): void {
    this.statisticsService.getUserStatistics().subscribe({
      next: (response: UserStatisticsDto[]) => {
        this.dataSource = new MatTableDataSource(response);
        setTimeout(() => this.dataSource.paginator = this.paginator);
      },
      error: (error) => {
        this.notyf.error(`שגיאה בטעינת סטטיסטיקות משתמשים: ${error.message}`);
        console.error('שגיאה בטעינת סטטיסטיקות משתמשים:', error);
      }
    });
  }

  loadSystemStatistics(): void {
    this.statisticsService.getSystemStatistics().subscribe({
      next: (response: SystemStatisticsDto) => {
        this.systemStatistics = response;

        // עדכון נתוני הגרף עם הצבעים החדשים
        this.systemBarChartData = {
          labels: ['סטטיסטיקות מערכת'],
          datasets: [
            {
              label: 'משתמשים',
              data: [this.systemStatistics.totalUsers],
              backgroundColor: '#12977b'
            },
            {
              label: 'תיקיות',
              data: [this.systemStatistics.totalFolders],
              backgroundColor: '#16b592'
            },
            {
              label: 'קבצים',
              data: [this.systemStatistics.totalFiles],
              backgroundColor: '#0e7961'
            }
          ]
        };

        setTimeout(() => {
          this.cdr.detectChanges();
          this.systemBarChart?.update();
        });
      },
      error: (error) => {
        this.notyf.error(`שגיאה בטעינת סטטיסטיקות מערכת: ${error.message}`);
        console.error('שגיאה בטעינת סטטיסטיקות מערכת:', error);
      }
    });
  }

  loadLessonStatistics(): void {
    // שימוש ב-forkJoin כדי לבצע בקשות מקבילות לשני סוגי שיעורים
    forkJoin({
      withTranscript: this.lessonService.getLessonsWithTranscript(),
      withoutTranscript: this.lessonService.getLessonsWithoutTranscript()
    }).subscribe({
      next: (result) => {
        const withTranscriptCount = result.withTranscript.length;
        const withoutTranscriptCount = result.withoutTranscript.length;
        const totalLessonsCount = withTranscriptCount + withoutTranscriptCount;
        
        // עדכון נתוני גרף העוגה כולל סך כל השיעורים
        this.lessonPieChartData = {
          ...this.lessonPieChartData,
          datasets: [
            {
              ...this.lessonPieChartData.datasets[0],
              data: [
                withTranscriptCount,
                withoutTranscriptCount,
                totalLessonsCount
              ],
              backgroundColor: [
                '#12977b',  // תכלת עבור שיעורים עם תמלול
                '#0e7961',  // תכלת כהה עבור שיעורים ללא תמלול
                '#333333'   // שחור עבור סך כל השיעורים
              ],
              hoverBackgroundColor: [
                '#16b592',
                '#16b592',
                '#666666'
              ]
            }
          ]
        };
        
        // אכיפת רינדור מיידי בעדיפות גבוהה
        Promise.resolve().then(() => {
          this.cdr.detectChanges();
          if (this.lessonPieChart) {
            this.lessonPieChart.update();
            console.log('גרף העוגה עודכן מיד');
          } else {
            // אם הפניית הגרף אינה זמינה עדיין, ניסיון חוזר עם השהייה קצרה
            setTimeout(() => {
              this.cdr.detectChanges();
              if (this.lessonPieChart) {
                this.lessonPieChart.update();
                console.log('גרף העוגה עודכן לאחר השהייה');
              }
            }, 50);
          }
        });
      },
      error: (error) => {
        this.notyf.error(`שגיאה בטעינת סטטיסטיקות שיעורים: ${error.message}`);
        console.error('שגיאה בטעינת סטטיסטיקות שיעורים:', error);
      }
    });
  }
}