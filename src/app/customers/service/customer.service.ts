import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl='http://localhost:3000'
  constructor(private _HttpClient:HttpClient) { }
  getAllCustomersData(param:any):Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/customers`,{params:param})
  }
  getTransactionsData():Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/transactions`)
  }
}
