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
  
  // tableOfCustomers:any[]=[];
  // tableOfTransaction:any[]=[];
  // ngOnInit(): void {
  //   this.onGetCustomersData();
  //   this.onGetTransactionData()
  // }
  // constructor(private _CustomerService:CustomerService){}
  // onGetCustomersData(){
  //   this._CustomerService.getAllCustomersData().subscribe({
  //     next:(res)=>{
  //      this.tableOfCustomers=res;
  //      console.log(this.tableOfCustomers)
  //     },
  //     error:(err)=>{
  //       console.log(err)
  //     }
  //   })
  // }
  // onGetTransactionData(){
  //   this._CustomerService.getTransactionsData().subscribe({
  //     next:(res)=>{
  //       this.tableOfTransaction=res;
  //       console.log(this.tableOfTransaction)
  //     },
  //     error:(err)=>{
  //       console.log(err)
  //     }
  //   })
  // }
  tableOfCustomers: any[] = [];
  tableOfTransactions: any[] = [];
  customersWithTransactions: any[] = [];
  searchKey:string = '';
  tableOfTAmount: any[]=[];
 newChart: any = [];
 userCount:any;
  totalAmount: any;

  ngOnInit(): void {
    this.onGetCustomersData();
    this.onGetTransactionData();
    this.userChart()
  }

  constructor(private _CustomerService: CustomerService) {}

  onGetCustomersData() {
    let params={
      name:this.searchKey
    }
    this._CustomerService.getAllCustomersData(params).subscribe({
      next: (res) => {
        console.log('Customers Data:', res);
        this.tableOfCustomers = res;
        this.combineCustomerTransactionData();
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
        this.tableOfTAmount = res.amount;
      
        this.combineCustomerTransactionData();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  combineCustomerTransactionData() {
    if (this.tableOfCustomers.length && this.tableOfTransactions.length) {
      this.customersWithTransactions = this.tableOfCustomers.map(customer => {
        const customerTransactions = this.tableOfTransactions.filter(transaction => transaction.customer_id === customer.id);
        const totalAmount = customerTransactions.reduce((sum, transaction) => sum + (transaction.amount ? parseFloat(transaction.amount) : 1), 30);
       
        return {
          ...customer,
          transactionCount: customerTransactions.length,
          totalAmount: totalAmount
          
        };
        
      });
      console.log('Combined Data:', this.customersWithTransactions);
    }
  }
  userChart(){
    this._CustomerService.getTransactionsData().subscribe({
      next:(res)=>{
        this.userCount=res;
        //this.tasksCount=res.data;
        console.log(this.userCount);
      
  
      },
      error:(err)=>{
        // console.log(err)
      },
      complete:()=>{
        this.newChart = new Chart('userChart', {
          type: 'bar',
          data: {
            labels: ['Customers', 'amount'],
            datasets: [{
              label: 'Count',
              data: [9,30],
              backgroundColor: ['#0D6EFD', '#6797db']
            }]
          }
        });
    }
    }
)}
}



