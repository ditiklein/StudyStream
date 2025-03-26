import { Component } from '@angular/core';
import { UsersService } from '../../Services/Auth/Users/users.service';
import { ChartOptions, ChartData, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, Title, Tooltip, Legend);  // נרשם את הסקאלות והאלמנטים

@Component({
  selector: 'app-user-growth',
  standalone: true,

  imports: [
    BaseChartDirective
    ],
  templateUrl: './user-growth.component.html',
  styleUrl: './user-growth.component.css'
})
export class UserGrowthComponent {
  public userGrowthData: any[] = [];
  public chartData: ChartData = {
    labels: [],
    datasets: [
      {
        label: 'צמיחה במספר המשתמשים',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'חודש ושנה'
        }
      },
      y: {
        title: {
          display: true,
          text: 'מספר משתמשים'
        }
      }
    }
  };

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.loadUserGrowthData();
  }

  loadUserGrowthData(): void {
    this.userService.getUserGrowthData().subscribe((data: any[]) => {
      this.userGrowthData = data;
      this.prepareChartData();
    });
  }

  prepareChartData(): void {
    const labels :any= [];
    const userCounts:any = [];
    
    this.userGrowthData.forEach(item => {
      const label = `${item.month}/${item.year}`;
      labels.push(label);
      userCounts.push(item.UserCount);
    });

    this.chartData.labels = labels;
    this.chartData.datasets[0].data = userCounts;
  }
}


