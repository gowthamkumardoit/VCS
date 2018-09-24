import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { URL } from '../constants/common.constant';
@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private httpClient: HttpClient) { }

  // Get Template List
  getTemplateList() {
    return this.httpClient.get(`${URL}templates`);
   }

   // Post Template Data
   postTemplateData(data) {
     return this.httpClient.post(`${URL}templates`, data);
   }

   // Update User Data
   updateTemplateData(data) {
     return this.httpClient.put(`${URL}templates/${data.id}`, data);
   }

   // Delete User
   deleteTemplate(data) {
     return this.httpClient.delete(`${URL}templates/${data.id}`);
   }

   getDataById(id) {
    return this.httpClient.get(`${URL}templates/${id}`);
   }

}
