import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL, URL1 } from '../constants/common.constant';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  // Get Details
  getList() {
    return this.httpClient.get(`${URL}task`);
  }

  // Get task List
  getTaskList() {
    return this.httpClient.get(`${URL1}tcreatetasks`);
  }

  // Post User Data
  createRole(data) {
    return this.httpClient.post(`${URL}userroles`, data);
  }

  // Update Role
  updateRole(data) {
    return this.httpClient.put(`${URL}userroles/${data.id}`, data);
  }

  // Delete Role
  deleteRole(data) {
    return this.httpClient.delete(`${URL}userroles/${data.id}`);
  }
}
