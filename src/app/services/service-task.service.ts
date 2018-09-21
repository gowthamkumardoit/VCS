import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../constants/common.constant';


@Injectable({
  providedIn: 'root'
})
export class ServiceTaskService {

  constructor(private httpClient: HttpClient) { }

   // Get Service Data
   getServiceList() {
    return this.httpClient.get(`${URL}servicecrts`);
   }

   // Post Service Data
   postServiceData(data) {
     return this.httpClient.post(`${URL}servicecrts`, data);
   }

   // Update Service Data
   updateService(data) {
     return this.httpClient.put(`${URL}servicecrts/${data.sid}`, data);
   }

   // Delete Service
   deleteService(data) {
     return this.httpClient.delete(`${URL}servicecrts/${data.sid}`);
   }
}
