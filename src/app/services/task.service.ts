import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../constants/common.constant';

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
    return this.httpClient.get(`${URL}tcreatetasks`);
  }

  // Post User Data
  createTasks(data) {
    return this.httpClient.post(`${URL}NewTaskDetail`, data);
  }

  // Save Files
  saveFiles(data) {
    return this.httpClient.post(`${URL}TaskAttachment`, data);
  }

  // Delete Role
  deleteRole(data) {
    return this.httpClient.delete(`${URL}userroles/${data.id}`);
  }
}
