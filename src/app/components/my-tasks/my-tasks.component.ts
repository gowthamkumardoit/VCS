import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import { CompleterService, CompleterData } from 'ng-uikit-pro-standard';
import { IMyOptions } from 'ng-uikit-pro-standard';
import * as _ from 'lodash';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
// import * as moment from 'ngx-moment';

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
  bsValue = new Date();
  colorTheme = 'theme-default';
  bsConfig: Partial<BsDatepickerConfig>;

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

  constructor(
    private nav: RoleService,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private taskService: TaskService,
    private completerService: CompleterService,
    private _localeService: BsLocaleService
  ) {
    this._localeService.use('engb');
    this.userid = Number(localStorage.getItem('userid'));
    this.getTaskList();
  }
  applyTheme(pop: any) {
    // create new object on each property change
    // so Angular can catch object reference change
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    setTimeout(() => {
      pop.show();
    });
  }
  ngOnInit() {

    this.nav.navigationBarShow.next(true);
    this.tableHeadings = ['No', 'Task Name', 'Company Name', 'Service Name', 'User Name'];

    this.taskForm = this.fb.group({
      companyid: ['', Validators.required],
      serviceid: ['', Validators.required],
      userid: ['', Validators.required],
      taskname: ['', [Validators.required, Validators.maxLength(40)]],
      description: ['', [Validators.required]],
      requiring: ['', Validators.required],
      createby: ['']
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
    this.selectedUserFollowup = '';
    this.dbFilesList = [];
    this.selectedFollowersList = [];
    this.dbChatList = [];
    this.dbSubTaskArray = [];
    this.dbInputChatArray = [];
    this.files = [];
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
      this.taskForm.markAsUntouched();
      this.taskForm.markAsPristine();
      this.taskForm.patchValue({
        companyid: this.companyList[0].value || '1',
        serviceid: this.serviceList[0].value || '1',
        userid:  this.userList[0].value || '1',
        taskname: '',
        description: '',
        requiring:  this.requiringArray[0].value,
      });
      this.messageInput = '';
      this.inputMessages = [];
      this.updatedSubTaskArray = [];
      this.dbUpdatedSubTaskArray = [];
    }, 300);
  }
  save(value) {

    if (this.taskForm.valid) {
      this.chatInputArray = [];
      this.inputMessages.forEach((val) => {
        this.chatInputArray.push({name: val.message});
      });
      let date1 = '';
      let date2 = '';
      let date3 = '';
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
          ...this.taskForm.value,
            companyid : Number(this.taskForm.value.companyid),
            serviceid :  Number(this.taskForm.value.serviceid),
            userid :  Number(this.taskForm.value.userid),
            requiringifany : (this.taskForm.value.requiring !== '' || this.taskForm.value.requiring !== null) ? 'Yes' : 'No',
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
        this.taskService.createTasks(obj).subscribe((res: any) => {
          if (res.isSaved) {
            setTimeout(() => {
              this.saveFiles(res.taskid);
            }, 300);
            this.getList();
            this.getTaskList();
            this.openModal();
          }
        });
      } else {
        const obj = {
          ...this.taskForm.value,
            companyid : Number(this.taskForm.value.companyid),
            serviceid :  Number(this.taskForm.value.serviceid),
            userid :  Number(this.taskForm.value.userid),
            requiringifany : (this.taskForm.value.requiring !== '' || this.taskForm.value.requiring !== null) ? 'Yes' : 'No',
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
        this.taskService.createTasks(obj).subscribe((res: any) => {
          if (res.isSaved) {
            this.getList();
            this.getTaskList();
            this.saveFiles(res.taskid);
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
    this.taskForm.reset();
    this.selectedUserFollowup = '';
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
          this.isEditTask = true;
          this.taskForm.patchValue({
            companyid: this.companyList.filter(val =>  val.label === item.compname )[0].value || '1',
            serviceid: this.serviceList.filter(val =>  val.label === item.servname )[0].value || '1',
            userid:  this.userList.filter(val => val.label === item.user )[0].value || '1',
            taskname: item.taskname,

            description: res.td.description,
            requiring:  this.requiringArray[Number(res.td.requiring) - 1].value,
            createby: res.td.createby
          });
          this.date1 = res.td.startdate;
          this.date2 = res.td.duedate;
          this.date3 = res.td.enddate;
          this.createdBy =  res.td.createby;
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
        this.dbInputChatArray = [];
        if (this.dbChatList && this.dbChatList.length > 0) {
          this.dbChatList.forEach((val) => {
            this.dbInputChatArray.push({ message: val.message, date: val.date });
          });
        }
        this.getFollowers(res.td.followup);
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
      this.selectedUserFollowup = val.value;
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
    const fileInput = document.getElementById('selectedFile');
    // files is a FileList object (similar to NodeList)
    const files = fileInput['files'];
    let file;
    // loop through files
      for (let i = 0; i < files.length; i++) {

        // get item
        file = files.item(i);
        // or
        file = files[i];
        this.files.push(files);

        alert(file.name);
      }
    // let newFile = $event.target;
    this.fileNamesArray.push($event.target.files[0].name);
  }

  removeFiles(index) {
    this.files.splice(index, 1);
  }
  removeFilesFromDb(index) {
    this.dbFilesList.splice(index, 1);
  }
  saveFiles(id) {
    this.newArray = [];
    // this.fileNamesArray = [];
    let obj = {};
    this.files.forEach((item: any, index: number) => {
        obj = {
          taskid: id,
          userid: this.userid,
          fname: this.fileNamesArray[index],
          attachment_details: this.encodeImageFileAsURL(this.files[index])
        };
        this.newArray.push(obj);
        obj = {};
    });
    setTimeout(() => {
    this.newArray.forEach(val => {
      this.taskService.saveFiles(val).subscribe((data: any) => {
      });
    });
  }, 350);
  }

  encodeImageFileAsURL(element) {
    if (element) {
      let url = '';
      const reader = new FileReader();
      reader.readAsDataURL(element[0]); // read file as data url
      reader.onload = ($event: any) => { // called once readAsDataURL is completed
        url = $event.target.result;
        if (url.indexOf('data:image/jpeg;base64,') > -1) {
          url =  url.replace('data:image/jpeg;base64,', '');
        } else if (url.indexOf('data:image/jpg;base64,') > -1) {
          url =  url.replace('data:image/jpg;base64,', '');
        } else if (url.indexOf('data:image/png;base64,') > -1) {
          url =  url.replace('data:image/png;base64,', '');
        } else if (url.indexOf('data:application/pdf;base64,') > -1) {
          url =  url.replace('data:application/pdf;base64,', '');
        } else if (url.indexOf('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64') > -1) {
          url =  url.replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '');
        }
       return url;
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
      let extension = '';
      let objbuilder = '';
      if (file.name) {
         extension = file.name.split('.')[1];
      }

      if (extension === 'jpg') {
        image.src = `data:image/jpg;base64,${dataUrl}`;
      } else if (extension === 'jpeg') {
        image.src = `data:image/jpeg;base64,${dataUrl}`;
      } else if (extension === 'png') {
        image.src = `data:image/png;base64,${dataUrl}`;
      } else if (extension === 'pdf') {
        const data = dataUrl;
          objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
          objbuilder += (data);
          objbuilder += ('" type="application/pdf" class="internal">');
          objbuilder += ('<embed src="data:application/pdf;base64,');
          objbuilder += (data);
          objbuilder += ('" type="application/pdf"  />');
          objbuilder += ('</object>');
      } else if (extension === 'docx') {
        const data = dataUrl;
          // tslint:disable-next-line:max-line-length
          objbuilder += ('<object width="100%" height="100%" data="data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,');
          objbuilder += (data);
          objbuilder += ('" type="application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="internal">');
          objbuilder += ('<embed src="data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,');
          objbuilder += (data);
          objbuilder += ('" type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"  />');
          objbuilder += ('</object>');
      }
      const w = window.open('');
      if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' ) {
         w.document.write(image.outerHTML);
      } else {
        w.document.write(objbuilder);
      }
    }
  }
}
