import { Component, OnInit } from '@angular/core';
import { CustomerService } from './service/customer.service';

import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  tableOfCustomers: any[] = [];
  tableOfTransactions: any[] = [];
  customersWithTransactions: any[] = [];
  searchKey: string = '';
  newChart: any = null;
  customerTransactionAmounts: { [key: number]: number } = {};
selectedFilter:string='';
  constructor(private _CustomerService: CustomerService) {}

  ngOnInit(): void {
    this.onGetCustomersData();
    this.onGetTransactionData();
  }

  onGetCustomersData() {
    let params = {
      name: this.searchKey,
    };

    this._CustomerService.getAllCustomersData(params).subscribe({
      next: (res) => {
        console.log('Customers Data:', res);
        this.tableOfCustomers = res;
        this.checkDataAndCombine();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onGetTransactionData() {
    this._CustomerService.getTransactionsData().subscribe({
      next: (res) => {
        console.log('Transactions Data:', res);
        this.tableOfTransactions = res;
        this.checkDataAndCombine();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  checkDataAndCombine() {
    if (this.tableOfCustomers.length > 0 && this.tableOfTransactions.length > 0) {
      this.combineCustomerTransactionData();
    }
  }

  combineCustomerTransactionData() {
    this.customerTransactionAmounts = this.tableOfCustomers.reduce((acc, customer) => {
      const totalAmount = this.tableOfTransactions.filter(transaction => transaction.customer_id === +customer.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      acc[customer.id] = totalAmount;
      return acc;
    }, {} as { [key: number]: number });

    this.customersWithTransactions = this.tableOfCustomers.map(customer => ({
      ...customer,
      totalAmount: this.customerTransactionAmounts[customer.id] || 0
    }));
    this.updateChart();
  }

  updateChart() {
    const customerNames = this.customersWithTransactions.map(c => c.name);
    const transactionAmounts = this.customersWithTransactions.map(c => c.totalAmount);

    if (this.newChart) {
      // this.newChart.destroy();
    }

    this.newChart = new Chart('userChart', {
      type: 'bar',
      data: {
        labels: customerNames,
        datasets: [{
          label: 'Total Amount',
          data: transactionAmounts,
          backgroundColor: 'rgba(103, 151, 219, 0.5)',
          borderColor: 'rgba(103, 151, 219, 1)',
          borderWidth: 1,
          // fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
  
      }
    });
  }

  }


