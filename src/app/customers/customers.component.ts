import { Component, OnInit } from '@angular/core';
import { CustomerService } from './service/customer.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  tableOfCustomers:any[]=[];
  tableOfTransaction:any[]=[];
  ngOnInit(): void {
    this.onGetCustomersData();
    this.onGetTransactionData()
  }
  constructor(private _CustomerService:CustomerService){}
  onGetCustomersData(){
    this._CustomerService.getAllCustomersData().subscribe({
      next:(res)=>{
       this.tableOfCustomers=res;
       console.log(this.tableOfCustomers)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
  onGetTransactionData(){
    this._CustomerService.getTransactionsData().subscribe({
      next:(res)=>{
        this.tableOfTransaction=res;
        console.log(this.tableOfTransaction)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

}
