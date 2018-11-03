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

  // Get Task Details, Date, Files, Chat, Subtask data in post method
  getFiles(data) {
    return this.httpClient.post(`${URL}task`, data);
  }

  // Get task List
  getTaskList(id) {
    return this.httpClient.get(`${URL}task/${id}`);
  }

  // Post User Data
  createTasks(data) {
    return this.httpClient.post(`${URL}NewTaskDetail`, data);
  }

  // updateData(data) {
  //   return this.httpClient.post(`${URL}updatedata`, data);
  // }

  // Save Files
  saveFiles(data) {
    return this.httpClient.post(`${URL}TaskAttachment`, data);
  }

  // Get Files by id
  getAllFileDetails(data) {
    return this.httpClient.post(`${URL}TaskAttachmentOut`, data);
  }

  // Delete Role
  deleteRole(data) {
    return this.httpClient.delete(`${URL}userroles/${data.id}`);
  }
}
