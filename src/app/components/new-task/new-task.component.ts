import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RoleService } from './../../services/role.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import { CompleterService, CompleterData } from 'ng-uikit-pro-standard';
import { IMyOptions } from 'ng-uikit-pro-standard';
import * as _ from 'lodash';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  @ViewChild('resizeText') resizeText: ElementRef;
  @ViewChild('fifthSection') fifthSection: ElementRef;
  @ViewChild('followersSection') followersSection: ElementRef;

  userName: any;
  userid: number;
  taskList: any;
  taskNameArray = [];
  bsValue = new Date();
  colorTheme = 'theme-default';
  bsConfig: Partial<BsDatepickerConfig>;

  dataService: CompleterData;
  dataService1: CompleterData;
  dataService2: CompleterData;
  dataService3: CompleterData;
  // taskForm: FormGroup;

  companyList: any = [];
  serviceList: any = [];
  userList: any = [];
  followList: any = [];


  requiringArray: any = [];
  showRightPanel: boolean;

  messageInput: string;
  tempArr: any[] = [];
  selectedFollowersList: any[] = [];
  followersId: any;

  inputMessages: any[] = [];
  files: any = [];
  updateTaskDetails: any;
  selectedValue: string;
  istaskExists: boolean;
  errorMessage: string;
  isEditTask: boolean;
  tableHeadings: any = [];

  base64Url: any;
  dbFilesList: any = [];
  allFilesBase64: any = [];

  subTaskArray: any = [];
  updatedSubTaskArray: any = [];
  dbSubTaskArray: any = [];
  dbUpdatedSubTaskArray: any = [];

  chatListArray: any = [];
  chatInputArray: any = [];
  dbChatList: any = [];
  dbInputChatArray: any = [];

  createdBy: any;
  fileNamesArray: any = [];

  newArray: any = [];
  date1: any;
  date2: any;
  date3: any;

  newCompanyName: any;
  newUserName: any;
  newServiceName: any;
  newTaskName: any;
  newDescription: any;
  newRequiring: any;
  newChatComment: string;
  newCompanyId: number;
  newServiceId: number;
  newUserId: number;
  newRequiringId: number;

  constructor(
    private nav: RoleService,
    private taskService: TaskService,
    private completerService: CompleterService,
    private _localeService: BsLocaleService,
    private fb: FormBuilder
    ) {
      this._localeService.use('engb');
    this.userid = Number(localStorage.getItem('userid'));
    this.getTaskNames();
     }

  ngOnInit() {
    this.nav.navigationBarShow.next(true);
    this.serviceList = [];
    this.companyList = [];
    this.userList = [];
    this.followList = [];
    this.newChatComment = '';

    this.userName = localStorage.getItem('userName').substr(0, 2).toUpperCase();
    // this.taskForm = this.fb.group({
    //   companyid: ['', Validators.required],
    //   serviceid: ['', Validators.required],
    //   userid: ['', Validators.required],
    //   taskname: ['', [Validators.required, Validators.maxLength(40)]],
    //   description: ['', [Validators.required]],
    //   requiring: ['', Validators.required],
    //   createby: ['']
    // });

    this.showRightPanel = false;
    setTimeout(() => {
      this.getList();
    }, 1000);
  }

  getTaskNames() {
    this.taskService.getTaskList(this.userid).subscribe((data: any) => {
      this.taskList = data.tot;
      this.taskNameArray = [];
      if (this.taskList && this.taskList.length > 0) {
        console.log(this.taskList);

        this.taskList.forEach((item) => {
          this.taskNameArray.push({name:  item.taskname});
        });
      }
      this.dataService = this.completerService.local(this.taskNameArray, 'name', 'name');
    });
  }

  onFocus() {
    this.resizeText.nativeElement.style.height = '150px';
    this.fifthSection.nativeElement.style.height = '100px';
    this.followersSection.nativeElement.style.marginTop = '100px';

  }

  onBlur() {
    this.resizeText.nativeElement.style.height = '50px';
    this.fifthSection.nativeElement.style.height = '200px';
    this.followersSection.nativeElement.style.marginTop = '0px';
  }

  getList() {
    this.taskService.getList().subscribe((res: any) => {
      if (res) {
          this.companyList = res.company,
          this.serviceList = res.service,
          this.userList = res.userdet;
          this.dataService1 = this.completerService.local(this.companyList, 'name', 'name');
          this.dataService3 = this.completerService.local(this.userList, 'name', 'name');
          this.dataService2 = this.completerService.local(this.serviceList, 'name', 'name');

      }
    });
  }
  clearDefaults() {
    this.newCompanyName = '';
    this.newServiceName = '';
    this.newUserName = '';
    this.newTaskName = '';
    this.newDescription = '';
    this.dbFilesList = [];
    this.selectedFollowersList = [];
    this.dbChatList = [];
    this.dbSubTaskArray = [];
    this.dbInputChatArray = [];
    this.files = [];
  }
  openModal() {
    this.showRightPanel = true;
    this.isEditTask = false;
    // this.selectedUserFollowup = '';
    this. clearDefaults();
    this.requiringArray = [
      { value: '1', label: 'Monthly' },
      { value: '2', label: 'Quartly' },
      { value: '3', label: 'Half Yearly' },
      { value: '4', label: 'Yearly' }
    ];
    this.date1 = moment(new Date()).format('DD/MM/YYYY');
    this.date2 = moment(new Date()).format('DD/MM/YYYY');
    this.date3 = moment(new Date()).format('DD/MM/YYYY');
    setTimeout(() => {

      this.messageInput = '';
      this.inputMessages = [];
      this.updatedSubTaskArray = [];
      this.dbUpdatedSubTaskArray = [];
    }, 300);
  }
  save(value) {

    if (this.newTaskName !==  '' && this.newDescription !== '') {
      this.chatInputArray = [];
      this.inputMessages.forEach((val) => {
        this.chatInputArray.push({name: val.message});
      });
      let date1 = '';
      let date2 = '';
      let date3 = '';
      this.getIds();
      if (!this.isEditTask) {
        if (this.date1 === moment(new Date()).format('DD/MM/YYYY')) {
          date1 = this.date1;
        } else {
          date1 =  moment(this.date1).format('DD/MM/YYYY');
        }
        if (this.date2 === moment(new Date()).format('DD/MM/YYYY')) {
          date2 = this.date2;
        } else {
          date2 =  moment(this.date2).format('DD/MM/YYYY');
        }
        if (this.date3 === moment(new Date()).format('DD/MM/YYYY')) {
          date3 = this.date3;
        } else {
          date3 =  moment(this.date3).format('DD/MM/YYYY');
        }

        const obj = {
            companyid : this.newCompanyId,
            serviceid : this.newServiceId,
            userid : this.newUserId,
            requiring: Number(this.newRequiring),
            requiringifany : (this.newRequiring !== '' || this.newRequiring !== null) ? 'Yes' : 'No',
            followup : (this.followersId === undefined ? 0 : Number(this.followersId) ),
            createby : Number(this.userid),
            subtask : this.updatedSubTaskArray,
            chatlist: this.chatInputArray,
            taskid : 0,
            data : 'save',
            startdate: date1,
            duedate: date2,
            enddate: date3,
            modifyby: Number(this.userid),
        };
        console.log(obj);
        // this.taskService.createTasks(obj).subscribe((res: any) => {
        //   if (res.isSaved) {
        //     setTimeout(() => {
        //       // this.saveFiles(res.taskid);
        //     }, 300);
        //     this.getList();
        //     this.getTaskNames();
        //     this.openModal();
        //   }
        // });
      } else {
        const obj = {
            companyid : this.newCompanyId,
            serviceid : this.newServiceId,
            userid : this.newUserId,
            requiring: Number(this.newRequiring),
            requiringifany :  (this.newRequiring !== '' || this.newRequiring !== null) ? 'Yes' : 'No',
            followup : (this.followersId === undefined ? 0 : Number(this.followersId) ),
            subtask : this.updatedSubTaskArray,
            chatlist: this.chatInputArray,
            taskid : Number(this.updateTaskDetails.taskid),
            data : 'update',
            modifyby: Number(this.userid),
            createby: Number(this.createdBy),
            // tslint:disable-next-line:max-line-length
            startdate: moment(this.date1).format('DD/MM/YYYY') !== this.date1 ? typeof(this.date1) === 'string' ? this.date1 : moment(this.date1).format('DD/MM/YYYY') : moment(this.date1).format('DD/MM/YYYY'),
            // tslint:disable-next-line:max-line-length
            duedate: moment(this.date2).format('DD/MM/YYYY') !== this.date2 ? typeof(this.date2) === 'string' ? this.date2 : moment(this.date2).format('DD/MM/YYYY') : moment(this.date2).format('DD/MM/YYYY'),
            // tslint:disable-next-line:max-line-length
            enddate: moment(this.date3).format('DD/MM/YYYY') !== this.date3 ? typeof(this.date3) === 'string' ? this.date3 : moment(this.date3).format('DD/MM/YYYY') : moment(this.date3).format('DD/MM/YYYY'),
        };
        console.log(obj);
        this.taskService.createTasks(obj).subscribe((res: any) => {
          if (res.isSaved) {
            this.getList();
            this.getTaskNames();
           // this.saveFiles(res.taskid);
            this.openModal();
            if (value === 'close') {
              this.showRightPanel = false;
            }
          }
        });
      }
    }
  }
  editTask(item) {
    // this.selectedUserFollowup = '';
    this.updateTaskDetails = item;
    this.showRightPanel = true;
    this.fileNamesArray = [];
    this.requiringArray = [
      { value: '1', label: 'Monthly' },
      { value: '2', label: 'Quartly' },
      { value: '3', label: 'Half Yearly' },
      { value: '4', label: 'Yearly' }
    ];
    const obj = {
      userid: this.userid,
      taskid: Number(item.taskid)
    };

    this.taskService.getFiles(obj).subscribe((res: any) => {
      if (res) {
          console.log(res);
          this.isEditTask = true;
          this.date1 = res.td.startdate;
          this.date2 = res.td.duedate;
          this.date3 = res.td.enddate;
          this.createdBy =  res.td.createby;
          this.newCompanyName = item.compname;
          this.newServiceName = item.servname;
          this.newUserName = item.user;
          this.newTaskName = item.taskname;
          this.newDescription = res.td.description;
          this.newRequiring = this.requiringArray[Number(res.td.requiring) - 1].value;
      }

      this.dbFilesList = [];
      this.dbFilesList = res.filelist;
      this.taskService.getAllFileDetails(obj).subscribe((response: any) => {
        this.allFilesBase64 = response.fn;
      });
      this.subTaskArray = res.subtasklist;
      this.dbChatList = res.chatlist;
        this.inputMessages = [];
        this.updatedSubTaskArray = [];
        this.dbUpdatedSubTaskArray = [];

        if (this.subTaskArray && this.subTaskArray.length > 0) {
          this.subTaskArray.forEach((val) => {
            this.updatedSubTaskArray.push({ name: val.name });
          });
        }
        console.log(this.updatedSubTaskArray);
        this.dbInputChatArray = [];
        if (this.dbChatList && this.dbChatList.length > 0) {
          this.dbChatList.forEach((val) => {
            this.dbInputChatArray.push({ message: val.message, date: val.date });
          });
        }
        // this.getFollowers(res.td.followup);
    });

  }

  addSubtask() {
    this.updatedSubTaskArray.push({name: ''});
  }

  comment() {
      if (this.newChatComment !== '') {
           this.inputMessages.push({message: this.newChatComment, date: new Date()});
      }
      this.newChatComment = '';
  }

  getIds() {
      this.companyList.forEach(item => {
        if (item.name === this.newCompanyName) {
          this.newCompanyId = Number(item.id);
        }
      });
      this.serviceList.forEach(item => {
        if (item.name === this.newServiceName) {
          this.newServiceId = Number(item.id);
        }
      });
      this.userList.forEach(item => {
        if (item.name === this.newUserName) {
          this.newUserId = Number(item.id);
        }
      });


  }
}
