import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service';
import { CompleterService, CompleterData } from 'ng-uikit-pro-standard';
import { IMyOptions } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {
  public myDatePickerOptions: IMyOptions = {
    closeAfterSelect: true,
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

  istaskExists: boolean;
  errorMessage: string;
  isEditTask: boolean;
  tableHeadings: any = [];
  taskList: any = [];

  companyList: any = [];
  serviceList: any = [];
  userList: any = [];

  taskName: any;
  date1: any;
  date2: any;
  date3: any;
  desc: string;
  requiringArray: any = [];
  selectedRequiring = '1';
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

    this.taskList = [
      { taskName: 'Task 1', companyName: 'Company 1', serviceName: 'Service 1', userName: 'User 1' },
      { taskName: 'Task 2', companyName: 'Company 2', serviceName: 'Service 2', userName: 'User 2' },
      { taskName: 'Task 3', companyName: 'Company 3', serviceName: 'Service 3', userName: 'User 3' },
      { taskName: 'Task 4', companyName: 'Company 4', serviceName: 'Service 4', userName: 'User 4' },
      { taskName: 'Task 5', companyName: 'Company 5', serviceName: 'Service 5', userName: 'User 5' },
    ];
    this.getPagination();
  }
  getPagination() {
    setTimeout(() => {
      this.paginators = [];
      if (this.taskList.length % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor(
          this.taskList.length / this.itemsPerPage
        );
      } else {
        this.numberOfPaginators = Math.floor(
          this.taskList.length / this.itemsPerPage + 1
        );
      }

      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }, 200);
  }
  closeDatePicker() {
    const element: HTMLCollection = document.getElementsByClassName('mydp');
    for (let i = 0; i < 10; i++) {
      if (element[i]['classList'].contains('picker--opened')) {
        element[i]['classList'].remove('picker--opened');
      }
    }
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
    // this.closeDatePicker();
    this.basicModal.show();
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
      this.selectedUserFollowup = this.userList[0].value || '1';
    }, 300)

  }
  save() {

  }

  editTask(item) {
    this.openModal();
    setTimeout(() => {
      this.isEditTask = true;
    }, 100)

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
