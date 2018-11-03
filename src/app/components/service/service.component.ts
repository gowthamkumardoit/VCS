import { RoleService } from './../../services/role.service';
import { ToastrService } from 'ngx-toastr';
import { STATUS } from './../../constants/common.constant';
import { Service } from './../../modals/service.modal';
import { ServiceTaskService } from './../../services/service-task.service';
import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  options: any = [];
  requiringArray: any = [];
  tableHeadings: any = [];
  taksHeadings: any = [];
  tableData: any = [];
  isTableDataPresent: boolean;
  isTaskDataPresent: boolean;
  defaultStatus;
  deletedServiceItem;
  serviceForm: FormGroup;
  taskForm: FormGroup;
  searchText: string;
  @ViewChild('deleteTasks') deleteTasks;
  @ViewChild('deleteService') deleteService;
  @ViewChild('basicModal') basicModal;


  serviceList: Service[] = [];
  serviceData: Service;
  taskArray = [];
  deletedTaskIndex: number;
  selectedValue: string;
  selectedValue1: string;
  selectedDuration: string;

  @ViewChildren('pages')
  pages: QueryList<any>;
  itemsPerPage = 5;
  numberOfVisiblePaginators = 10;
  numberOfPaginators: number;
  paginators: Array<any> = [];
  activePage = 1;
  firstVisibleIndex = 1;
  lastVisibleIndex: number = this.itemsPerPage;
  firstVisiblePaginator = 0;
  lastVisiblePaginator = this.numberOfVisiblePaginators;

  isEditService: boolean;
  isServiceExists: boolean;
  errorMessage: string;
  userid: number;
  toastOptions: any;

  constructor(private service: ServiceTaskService,
    private fb: FormBuilder, private nav: RoleService,
    private toastService: ToastrService) {
    this.serviceForm = fb.group({
      servicename: ['', [Validators.required, Validators.maxLength(90)]],
      statusser: ['', [Validators.required]],
    });

    this.taskForm = fb.group({
      taskname: ['', [Validators.required, Validators.maxLength(40)]],
      duration: ['', [Validators.required, Validators.maxLength(8)]],
      requiring: ['', Validators.required],
      statustas: ['', Validators.required],
    });
    this.getServiceList();
  }

  ngOnInit() {
    this.nav.navigationBarShow.next(true);
    this.taskArray = [];
    this.getPagination();

    this.tableHeadings = ['No', 'Service Name', 'Status', 'Created On', 'Modified On', 'Action'];
    this.taksHeadings = ['Task Name', 'Duration', 'Requiring', 'Task Status', 'Action'];
    this.defaultStatus = STATUS;
    this.serviceData = {
      ...this.serviceData,
      sid: 0
    };

    this.userid = Number(localStorage.getItem('userid'));
    this.toastOptions = {
      progressBar: true,
      timeOut: 1000,
      toastClass: 'black',
      closeButton: true
    };
  }
  getPagination() {
    setTimeout(() => {
      this.paginators = [];
      if (this.serviceList.length % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor(
          this.serviceList.length / this.itemsPerPage
        );
      } else {
        this.numberOfPaginators = Math.floor(
          this.serviceList.length / this.itemsPerPage + 1
        );
      }

      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }, 200);
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
      return this.serviceList;
    }
    if (this.searchText) {
      return this.filterIt(this.serviceList, this.searchText);
    }
  }
  openModal() {
    this.serviceForm.setValue({
      'servicename': '',
      'statusser': null
    });
    this.taskForm.setValue({
      taskname: '',
      duration: '',
      requiring: null,
      statustas: null,
    });
    this.serviceData = {
      ...this.serviceData,
      sid: 0
    };

    this.serviceForm.reset();
    this.taskForm.reset();
    this.basicModal.show();
    this.taskArray = [];
    this.isServiceExists = false;

    this.options = [
      { value: '1', label: 'Live' },
      { value: '2', label: 'Dormant' }
    ];
    this.requiringArray = [
      { value: '1', label: 'Monthly' },
      { value: '2', label: 'Quartly' },
      { value: '3', label: 'Half Yearly' },
      { value: '4', label: 'Yearly' }
    ];
    this.isEditService = false;

    setTimeout(() => {
      this.selectedValue = '1';
      this.selectedDuration = '1';
      this.selectedValue1 = '1';
    }, 200);

  }
  getServiceList() {
    this.service.getServiceList().subscribe((data: any) => {
      this.taskArray = [];
      if (data) {
        this.serviceList = data;
      } else {
        this.serviceList = [];
        this.taskArray = [];
      }
    });
  }

  saveTask() {
    this.taskArray.push({...this.taskForm.value,  createby: this.userid});
    this.toastService.success('Task Added Successfully', '', this.toastOptions);
    this.taskForm.setValue({
      taskname: '',
      duration: '',
      requiring: null,
      statustas: null,
    });
    this.taskForm.reset();
    this.options = [
      { value: '1', label: 'Live' },
      { value: '2', label: 'Dormant' }
    ];
    this.requiringArray = [
      { value: '1', label: 'Monthly' },
      { value: '2', label: 'Quartly' },
      { value: '3', label: 'Half Yearly' },
      { value: '4', label: 'Yearly' }
    ];

    setTimeout(() => {
      this.selectedValue = '1';
      this.selectedValue1 = '1';
      this.selectedDuration = '1';
    }, 200);
  }

  deleteConfirmTasks() {
    if (this.deletedTaskIndex > -1) {
      this.taskArray.splice(this.deletedTaskIndex, 1);
      this.deleteTasks.hide();
      this.toastService.success('Task Deleted Successfully', '', this.toastOptions);
    }
  }

  deleteTask(index) {
    this.deletedTaskIndex = index;
    this.deleteTasks.show();
  }

  saveService() {
    if (this.serviceData.sid === 0) {
      this.createService();
    } else if (this.serviceData.sid > 0) {
      this.updateService();
    }

  }
  createService() {
    let postData = {};
    postData = {
      ...postData,
      ...this.serviceForm.value,
      task: this.taskArray,
      Createby: this.userid
    };
    this.service.postServiceData(postData).subscribe((data: any) => {
      if (data && data.isSaved === 'false') {
        this.isServiceExists = true;
        this.errorMessage = data.Message;
      } else {
        this.toastService.success('Service Added Successfully', '', this.toastOptions);
        this.basicModal.hide();
        this.getServiceList();
        this.getPagination();
        this.isServiceExists = false;
      }

    });
  }

  updateService() {
    let postData = {};
    let postTaskArray = [];
    this.serviceData = {
      ...this.serviceData,
      servicename: this.serviceForm.value.servicename,
      statusser: this.serviceForm.value.statusser
    };
    this.taskArray.push(this.taskArray.forEach(item => {
      postTaskArray.push({ ...item, 'id': this.serviceData.sid });
    }));
    postData = {
      ...postData,
      ... this.serviceData,
      task: postTaskArray,
      modifyby: this.userid
    };
    this.service.updateService(postData).subscribe((data: any) => {
      if (data && data.isSaved === 'false') {
        this.isServiceExists = true;
        this.errorMessage = data.Message;
      } else {
        this.toastService.success('Service Updated Successfully', '', this.toastOptions);
        this.basicModal.hide();
        this.getServiceList();
        this.getPagination();
        postTaskArray = [];
        this.isServiceExists = false;
      }
    });
  }
  editService(data) {
    this.isEditService = true;
    this.isServiceExists = false;
    data = {
      ...data,
      statusser: (data.statusser).toString()
    };
    this.options = [
      { value: '1', label: 'Live' },
      { value: '2', label: 'Dormant' }
    ];
    this.requiringArray = [
      { value: '1', label: 'Monthly' },
      { value: '2', label: 'Quartly' },
      { value: '3', label: 'Half Yearly' },
      { value: '4', label: 'Yearly' }
    ];
    this.basicModal.show();
    this.serviceForm.setValue({
      'servicename': data.servicename,
      'statusser': data.statusser
    });
    this.taskArray = data.task;
    this.serviceData = data;
  }

  deleteServiceItem(item) {
    this.deletedServiceItem = item;
    this.deleteService.show();
  }

  deleteConfirmService() {
    if (this.deletedServiceItem) {
      this.service.deleteService(this.deletedServiceItem).subscribe(data => {
        this.toastService.success('Service Deleted Successfully', '', this.toastOptions);
        this.deleteService.hide();
        this.getServiceList();
        this.getPagination();
      });
    }
  }

  // Pagination code
  changePage(event: any) {
    if (
      event.target.text >= 1 &&
      event.target.text <= this.numberOfPaginators
    ) {
      this.activePage = +event.target.text;
      this.firstVisibleIndex =
        this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
      this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    }
  }

  nextPage(event: any) {
    // if (this.pages.last.nativeElement.classList.contains('active')) {
    if (
      this.numberOfPaginators - this.numberOfVisiblePaginators >=
      this.lastVisiblePaginator
    ) {
      this.firstVisiblePaginator += this.numberOfVisiblePaginators;
      this.lastVisiblePaginator += this.numberOfVisiblePaginators;
    } else {
      this.firstVisiblePaginator += this.numberOfVisiblePaginators;
      this.lastVisiblePaginator = this.numberOfPaginators;
    }
    // }

    this.activePage += 1;
    this.firstVisibleIndex =
      this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  previousPage(event: any) {
    //  if (this.pages.first.nativeElement.classList.contains('active')) {
    if (
      this.lastVisiblePaginator - this.firstVisiblePaginator ===
      this.numberOfVisiblePaginators
    ) {
      this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
      this.lastVisiblePaginator -= this.numberOfVisiblePaginators;
    } else {
      this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
      this.lastVisiblePaginator -=
        this.numberOfPaginators % this.numberOfVisiblePaginators;
    }
    //  }

    this.activePage -= 1;
    this.firstVisibleIndex =
      this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  firstPage() {
    this.activePage = 1;
    this.firstVisibleIndex =
      this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    this.firstVisiblePaginator = 0;
    this.lastVisiblePaginator = this.numberOfVisiblePaginators;
  }

  lastPage() {
    this.activePage = this.numberOfPaginators;
    this.firstVisibleIndex =
      this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;

    if (this.numberOfPaginators % this.numberOfVisiblePaginators === 0) {
      this.firstVisiblePaginator =
        this.numberOfPaginators - this.numberOfVisiblePaginators;
      this.lastVisiblePaginator = this.numberOfPaginators;
    } else {
      this.lastVisiblePaginator = this.numberOfPaginators;
      this.firstVisiblePaginator =
        this.lastVisiblePaginator -
        (this.numberOfPaginators % this.numberOfVisiblePaginators);
    }
  }

}
