import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import { CompleterService, CompleterData } from 'ng-uikit-pro-standard';
import { IMyOptions } from 'ng-uikit-pro-standard';
import * as _ from 'lodash';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {
  public myDatePickerOptions: IMyOptions = {
    closeAfterSelect: true,
   // dateFormat: 'yyyy.mm.dd'
  };
  dataService: CompleterData;
  dataService1: CompleterData;
  dataService2: CompleterData;
  selectedCompany: any = '1';
  selectedService: any = '1';
  selectedUser: any = '1';
  selectedUserFollowup: any = '1';

  taskForm: FormGroup;
  searchText: string;
  deletedItem: any;
  @ViewChild('basicModal')
  basicModal;
  @ViewChild('delete')
  deleteModal;
  selectedValue: string;


  istaskExists: boolean;
  errorMessage: string;
  isEditTask: boolean;
  tableHeadings: any = [];
  taskList: any = [];

  companyList: any = [];
  serviceList: any = [];
  userList: any = [];

  taskName: string;
  date1: any;
  date2: any;
  date3: any;
  desc: string;
  requiringArray: any = [];
  selectedRequiring = '1';
  showRightPanel: boolean;

  messageInput: string;
  followList: any;
  tempArr: any[] = [];
  selectedFollowersList: any[] = [];

  userName: string;
  inputMessages: any[] = [];
  fileNames: any = [];
  constructor(
    private nav: RoleService,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private taskService: TaskService,
    private completerService: CompleterService
  ) { }

  ngOnInit() {

    this.nav.navigationBarShow.next(true);
    this.tableHeadings = ['No', 'Task Name', 'Company Name', 'Service Name', 'User Name'];
    this.getList();

    this.taskForm = this.fb.group({
      uname: ['', Validators.required],
      pwd: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.showRightPanel = false;

    this.userName = localStorage.getItem('userName').substr(0, 2).toUpperCase();
    this.getTaskList();
  }

  closeDatePicker() {
    const element: HTMLCollection = document.getElementsByClassName('mydp');
    for (let i = 0; i < 10; i++) {
      if (element[i]['classList'].contains('picker--opened')) {
        element[i]['classList'].remove('picker--opened');
      }
    }
  }

  getTaskList() {
    this.taskService.getTaskList().subscribe(data => {
      console.log('get', data);
      this.taskList = data;
    });
  }
  getList() {
    this.taskService.getList().subscribe((res: any) => {
      if (res) {
        this.companyList = res.company,
          this.serviceList = res.service,
          this.userList = res.userdet;
        for (let i = 0; i < this.companyList.length; i++) {
          this.companyList[i].value = this.companyList[i]['id'];
          this.companyList[i].label = this.companyList[i]['name'];
          delete this.companyList[i].id;
          delete this.companyList[i].name;
        }
        for (let i = 0; i < this.userList.length; i++) {
          this.userList[i].value = this.userList[i]['id'];
          this.userList[i].label = this.userList[i]['name'];
          delete this.userList[i].id;
          delete this.userList[i].name;

          this.followList = _.map(this.userList, _.clone);
        }
        for (let i = 0; i < this.serviceList.length; i++) {
          this.serviceList[i].value = this.serviceList[i]['id'];
          this.serviceList[i].label = this.serviceList[i]['name'];
          delete this.serviceList[i].id;
          delete this.serviceList[i].name;
        }
      }
    });
  }
  openModal() {
    this.showRightPanel = true;
    this.isEditTask = false;

    this.requiringArray = [
      { value: '1', label: 'Monthly' },
      { value: '2', label: 'Quartly' },
      { value: '3', label: 'Half Yearly' },
      { value: '4', label: 'Yearly' }
    ];
    setTimeout(() => {
      this.selectedCompany = this.companyList[0].value || '1';
      this.selectedService = this.serviceList[0].value || '1';
      this.selectedUser = this.userList[0].value || '1';
      this.selectedRequiring = this.requiringArray[0].value;
      this.taskName = '';
      this.date1 = '';
      this.date2 = '';
      this.date3 = '';
      this.desc = '';
      this.messageInput = '';

    }, 300);

  }
  save() {

  }

  editTask(item) {
    this.showRightPanel = true;
    this.requiringArray = [
      { value: '1', label: 'Monthly' },
      { value: '2', label: 'Quartly' },
      { value: '3', label: 'Half Yearly' },
      { value: '4', label: 'Yearly' }
    ];
    setTimeout(() => {
      this.isEditTask = true;
      console.log(item);
      this.selectedCompany = this.companyList.filter(val =>  val.label === item.Companydetail.companyname1 )[0].value || '1';
      this.selectedService = this.serviceList.filter(val =>  val.label === item.servicecrt.servicename )[0].value || '1';
      this.selectedUser = this.userList.filter(val => val.label === item.usercreate.username )[0].value || '1';
      this.selectedRequiring = this.requiringArray[0].value;
      this.taskName = item.taskname;
      this.date1 = item.startdate;
      this.date2 = item.duedate;
      this.date3 = item.enddate;
    }, 100);

  }
  filterIt(arr, searchKey) {
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        return obj[key] === null ? obj[key] : (obj[key]).toString().includes(searchKey);

      });
    });
  }

  search() {
    if (!this.searchText) {
      return this.taskList;
    }
    if (this.searchText) {
      return this.filterIt(this.taskList, this.searchText);
    }
  }

  deleteTask(item) {
    this.deletedItem = item;
    this.deleteModal.show();
  }
  deleteConfirm() {
    if (this.deletedItem) {
    }
  }

  changedFollowers(event) {
    this.followList.filter(val => {
      if (val.value === event) {
        this.tempArr.push(val);
      }
    });

    this.selectedFollowersList = _.uniqBy(_.map(this.tempArr, _.clone), 'value');
    this.selectedFollowersList = this.selectedFollowersList.map(val => {
      return (val.label).substr(0, 2).toUpperCase();
    });

    // this.followList = this.followList.filter(val => {
    //   return val.value != event;
    // });
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.inputMessages.push(event.target.value);
      event.target.value = '';
      console.log(event.target.value);
    }
  }

  enter(event) {

  }

  onSelectedFile($event) {
    console.log($event);
    // this.fileNames = [];
    this.fileNames.push($event.target.files[0].name);
    console.log(this.fileNames);
  }

  removeFiles(index) {
    this.fileNames.splice(index, 1);
  }
}
