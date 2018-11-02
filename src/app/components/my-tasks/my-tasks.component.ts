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

  userName: string;
  inputMessages: any[] = [];
  files: any = [];
  userid: any;
  updateTaskDetails: any;
  taskNameArray: any = [];
  base64Url: any;

  constructor(
    private nav: RoleService,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private taskService: TaskService,
    private completerService: CompleterService
  ) {
    this.getTaskList();
  }

  ngOnInit() {

    this.nav.navigationBarShow.next(true);
    this.tableHeadings = ['No', 'Task Name', 'Company Name', 'Service Name', 'User Name'];
    this.getList();

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
    this.userid = Number(localStorage.getItem('userid'));
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
      this.taskNameArray = [];
      if (this.taskList && this.taskList.length > 0) {
        this.taskList.forEach((item) => {
          this.taskNameArray.push({name:  item.taskname});
        });
      }
      this.dataService = this.completerService.local(this.taskNameArray, 'name', 'name');
      console.log(this.dataService);
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
    }, 300);

  }
  save() {

    if (!this.isEditTask) {
      const obj = {
        ...this.taskForm.value,
          companyid : Number(this.taskForm.value.companyid),
          serviceid :  Number(this.taskForm.value.serviceid),
          userid :  Number(this.taskForm.value.userid),
          requiringifany : (this.taskForm.value.requiring !== '' || this.taskForm.value.requiring !== null) ? 'Yes' : 'No',
          followup : (this.tempArr || this.tempArr[0] || this.tempArr[0].value === undefined ? 0 : Number(this.tempArr[0].value) )  ,
          createby : this.userid,
          subtask : [],
          taskid : 0,
          data : 'save',
          modifyby: this.userid
      };
      this.taskService.createTasks(obj).subscribe((res: any) => {
        if (res.isSaved) {
          // this.updateTaskDetails.id = Number(res.taskid);
          setTimeout(() => {
            this.saveFiles();
          }, 300);
          // this.getList();
          // this.getTaskList();
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
          subtask : [],
          taskid : this.updateTaskDetails.id,
          data : 'update',
          modifyby: this.userid
      };
      this.taskService.createTasks(obj).subscribe((res: any) => {
        console.log('edit save');
        if (res.isSaved) {
          // this.getList();
          // this.getTaskList();
          this.saveFiles();
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
    setTimeout(() => {
      this.isEditTask = true;
      this.taskForm.patchValue({
        companyid: this.companyList.filter(val =>  val.label === item.Companydetail.companyname1 )[0].value || '1',
        serviceid: this.serviceList.filter(val =>  val.label === item.servicecrt.servicename )[0].value || '1',
        userid:  this.userList.filter(val => val.label === item.usercreate.username )[0].value || '1',
        taskname: item.taskname,
        startdate: new Date(item.startdate),
        duedate: new Date(item.duedate),
        enddate: new Date(item.enddate),
        description: item.description,
        requiring:  this.requiringArray[0].value,
      });

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
    this.tempArr = [];
    this.followList.filter(val => {
      if (val.value === event) {
        this.tempArr.push(val);
      }
    });
    console.log('aa', this.tempArr);
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
    this.files.push($event.target);
    console.log(this.files);
  }

  removeFiles(index) {
    this.files.splice(index, 1);
    console.log('after remove', this.files);
  }

  saveFiles() {
    const newArray = [];

    this.files.forEach((item: any) => {
    this.encodeImageFileAsURL(item);
      setTimeout(() => {
        const obj = {
          taskid: 19,
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
        console.log(data);
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
        console.log(url);
        this.base64Url = url;
      };
    }
  }
}
