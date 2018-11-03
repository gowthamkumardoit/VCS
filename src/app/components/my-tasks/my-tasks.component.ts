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

  requiringArray: any = [];
  showRightPanel: boolean;

  messageInput: string;
  followList: any;
  tempArr: any[] = [];
  selectedFollowersList: any[] = [];
  followersId: any;

  userName: string;
  inputMessages: any[] = [];
  files: any = [];
  userid: any;
  updateTaskDetails: any;
  taskNameArray: any = [];
  base64Url: any;
  dbFilesList: any = [];
  allFilesBase64: any = [];

  subTaskArray: any = [];
  updatedSubTaskArray: any = [];

  chatListArray: any = [];
  chatInputArray: any = [];

  dateArray: any = [];
  createdBy: any;
  fileNamesArray: any = [];
  constructor(
    private nav: RoleService,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private taskService: TaskService,
    private completerService: CompleterService
  ) {
    this.userid = Number(localStorage.getItem('userid'));
    this.getTaskList();
  }

  ngOnInit() {

    this.nav.navigationBarShow.next(true);
    this.tableHeadings = ['No', 'Task Name', 'Company Name', 'Service Name', 'User Name'];

    this.taskForm = this.fb.group({
      companyid: ['', Validators.required],
      serviceid: ['', Validators.required],
      userid: ['', Validators.required],
      taskname: ['', [Validators.required, Validators.maxLength(40)]],
      startdate: ['', [Validators.required]],
      duedate: ['', Validators.required],
      enddate: ['', Validators.required],
      description: ['', [Validators.required]],
      requiring: ['', Validators.required],
    });

    this.showRightPanel = false;

    this.userName = localStorage.getItem('userName').substr(0, 2).toUpperCase();
    setTimeout(() => {
      this.getList();
    }, 1000);

  }
  trackByIndex(index: number, obj: any): any {
    return index;
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
      this.taskService.getTaskList(this.userid).subscribe((data: any) => {
        this.taskList = data.tot;
        this.taskNameArray = [];
        if (this.taskList && this.taskList.length > 0) {
          this.taskList.forEach((item) => {
            this.taskNameArray.push({name:  item.taskname});
          });
        }
        this.dataService = this.completerService.local(this.taskNameArray, 'name', 'name');

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
        this.dataService1 = this.completerService.local(this.taskNameArray, 'name', 'name');
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
      this.taskForm.markAsUntouched();
      this.taskForm.markAsPristine();
      this.taskForm.patchValue({
        companyid: this.companyList[0].value || '1',
        serviceid: this.serviceList[0].value || '1',
        userid:  this.userList[0].value || '1',
        taskname: '',
        startdate: new Date(),
        duedate: new Date(),
        enddate: new Date(),
        description: '',
        requiring:  this.requiringArray[0].value,
      });
      this.messageInput = '';
      this.inputMessages = [];
      this.updatedSubTaskArray = [];
    }, 300);

  }
  save() {
    this.chatInputArray = [];
    this.inputMessages.forEach((val) => {
      this.chatInputArray.push({name: val.message});
    });
    if (!this.isEditTask) {
      const obj = {
        ...this.taskForm.value,
          companyid : Number(this.taskForm.value.companyid),
          serviceid :  Number(this.taskForm.value.serviceid),
          userid :  Number(this.taskForm.value.userid),
          requiringifany : (this.taskForm.value.requiring !== '' || this.taskForm.value.requiring !== null) ? 'Yes' : 'No',
          followup : (this.followersId === undefined ? 0 : this.followersId ),
          createby : this.userid,
          subtask : this.updatedSubTaskArray,
          chatlist: this.chatInputArray,
          taskid : 0,
          data : 'save',
          modifyby: this.userid,
      };
      this.taskService.createTasks(obj).subscribe((res: any) => {
        if (res.isSaved) {
          setTimeout(() => {
            this.saveFiles(res.taskid);
          }, 300);
          this.getList();
          this.getTaskList();
        }
      });
    } else {
      const obj = {
        ...this.taskForm.value,
          companyid : Number(this.taskForm.value.companyid),
          serviceid :  Number(this.taskForm.value.serviceid),
          userid :  Number(this.taskForm.value.userid),
          requiringifany : (this.taskForm.value.requiring !== '' || this.taskForm.value.requiring !== null) ? 'Yes' : 'No',
          followup : (this.tempArr || this.tempArr[0] || this.tempArr[0].value === undefined ? 0 : Number(this.tempArr[0].value) )  ,
          subtask : this.updatedSubTaskArray,
          chatlist: this.chatInputArray,
          taskid : this.updateTaskDetails.id,
          data : 'update',
          modifyby: this.userid,
          createby: Number(this.createdBy)
      };
      this.taskService.createTasks(obj).subscribe((res: any) => {
        if (res.isSaved) {
          this.getList();
          this.getTaskList();
          this.saveFiles(res.taskid);
        }
      });
    }
  }

  editTask(item) {
    this.updateTaskDetails = item;
    this.showRightPanel = true;
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
      setTimeout(() => {
        this.isEditTask = true;
        this.taskForm.patchValue({
          companyid: this.companyList.filter(val =>  val.label === item.compname )[0].value || '1',
          serviceid: this.serviceList.filter(val =>  val.label === item.servname )[0].value || '1',
          userid:  this.userList.filter(val => val.label === item.user )[0].value || '1',
          taskname: item.taskname,
          startdate: new Date(res.td.startdate),
          duedate: new Date(res.td.duedate),
          enddate: new Date(res.td.enddate),
          description: res.td.description,
          requiring:  this.requiringArray[Number(res.td.requiring) - 1].value,
        });
        this.createdBy =  res.createby;
      }, 100);
      this.dbFilesList = [];
      this.dbFilesList = res.filelist;
      this.taskService.getAllFileDetails(obj).subscribe((response: any) => {
        this.allFilesBase64 = response.fn;
      });
      this.subTaskArray = res.subtasklist;
      this.chatListArray = res.chatlist;
        this.inputMessages = [];
        this.updatedSubTaskArray = [];
        if (this.subTaskArray && this.subTaskArray.length > 0) {
          this.subTaskArray.forEach((val) => {
            this.updatedSubTaskArray.push({ name: val.name });
          });
        }
        if (this.chatListArray && this.chatListArray.length > 0) {
          this.chatListArray.forEach((val) => {
            this.inputMessages.push({ message: val.message, date: val.date });

          });
          this.dateArray = [];
          this.inputMessages.forEach(val => {
            this.dateArray.push(new Date(val.date ));
          });
        }
        this.getFollowers(res.td.requiring);
    });

  }
  getFollowers(followId) {
    this.tempArr = [];
    this.followList.filter(val => {
      if (val.value === followId) {
        this.tempArr.push(val);
      }
    });
    this.selectedFollowersList = _.uniqBy(_.map(this.tempArr, _.clone), 'value');
    this.selectedFollowersList = this.selectedFollowersList.map(val => {
      this.followersId = val.value;
      return (val.label).substr(0, 2).toUpperCase();
    });
  }
  addSubtask() {
    this.updatedSubTaskArray.push({name: ''});
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
    this.tempArr = [];
    this.followList.filter(val => {
      if (val.value === event) {
        this.tempArr.push(val);
      }
    });
    this.selectedFollowersList = _.uniqBy(_.map(this.tempArr, _.clone), 'value');
    this.selectedFollowersList = this.selectedFollowersList.map(val => {
      this.followersId = val.value;
      return (val.label).substr(0, 2).toUpperCase();
    });
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.inputMessages.push({message: event.target.value, date: new Date()});
      event.target.value = '';
    }
  }

  enter(event) {

  }

  onSelectedFile($event) {
    this.files.push($event.target);
    console.log($event.target.files[0].name);
    this.fileNamesArray.push($event.target.files[0].name);
    console.log(this.fileNamesArray);

  }

  removeFiles(index) {
    this.files.splice(index, 1);
  }
  removeFilesFromDb(index) {
    this.dbFilesList.splice(index, 1);
  }
  saveFiles(id) {
    const newArray = [];
    this.fileNamesArray = [];
    this.files.forEach((item: any) => {
    this.encodeImageFileAsURL(item);
      setTimeout(() => {
        const obj = {
          taskid: id,
          userid: this.userid,
          fname: item.files[0].name,
          attachment_details : this.base64Url
        };

        newArray.push(obj);
      }, 300);
    });
    setTimeout(() => {
    newArray.forEach(val => {
      this.taskService.saveFiles(val).subscribe((data: any) => {
      });
    });
  }, 350);
  }

  encodeImageFileAsURL(element) {
    if (element.files && element.files[0]) {
      let url = '';
      const reader = new FileReader();
      reader.readAsDataURL(element.files[0]); // read file as data url
      reader.onload = ($event: any) => { // called once readAsDataURL is completed
        url = $event.target.result;
        url =  url.replace('data:image/jpeg;base64,', '');
        this.base64Url = url;
      };
    }
  }

  openFileinTarget(file) {
    if (file) {
    let dataUrl =  '';
     this.allFilesBase64.forEach((item) => {
      if (item.fname = file.name) {
        dataUrl = item.fbase64;
      }
    });
      const image = new Image();
      image.src = `data:image/jpg;base64,${dataUrl}`;
      const w = window.open('');
      w.document.write(image.outerHTML);
    }
  }
}
