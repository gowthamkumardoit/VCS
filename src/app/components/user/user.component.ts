// import { ToastService } from 'ng-uikit-pro-standard';
import { User } from './../../modals/user.modal';
import { UserService } from './../../services/user.service';
import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoleService } from './../../services/role.service';
import { STATUS } from './../../constants/common.constant';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  options: any = [];
  tableHeadings: any = [];
  tableData: any = [];
  isTableDataPresent: boolean;
  userList: User[] = [];
  userForm: FormGroup;
  user;
  userRoles = [];
  userTypeOptions = [];
  defaultStatus;
  @ViewChild('basicModal')
  basicModal;
  @ViewChild('deleteModal')
  deleteModal;
  deletedItem;
  searchText: string;
  selectedValue = '1';
  selectedValue1 = '1';
  selectedValue2 = '1';
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

  isEditUser: boolean;
  isUserExists: boolean;
  errorMessage: string;
  userid: any;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private roleService: RoleService,
   /// private toastService: ToastService,
    private nav: RoleService
  ) {
    this.userForm = fb.group({
      userId: ['', Validators.required],
      userName: ['', [Validators.required]],
      nricno: ['', Validators.required],
      userType: ['', Validators.required],
      userRole: ['', Validators.required],
      status: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.max(9999999999)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.getUserList();
  }

  getPagination() {
    setTimeout(() => {
      this.paginators = [];
      if (this.userList.length % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor(
          this.userList.length / this.itemsPerPage
        );
      } else {
        this.numberOfPaginators = Math.floor(
          this.userList.length / this.itemsPerPage + 1
        );
      }
      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }, 200);
  }
  ngOnInit() {
    this.nav.navigationBarShow.next(true);
    this.options = [
      { value: '1', label: 'Live', selected: true },
      { value: '2', label: 'Dormant' }
    ];
    this.userTypeOptions = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' }
    ];

    this.tableHeadings = [
      'No',
      'User Name',
      'NRIC No',
      'User Type',
      'User Role',
      'Status',
      'Email',
      'Mobile',
      'Password',
      'Actions'
    ];
    this.isTableDataPresent = false;
    this.defaultStatus = STATUS;
    this.user = {
      ...this.user,
      id: 0
    };
    this.selectedValue = '1';
    this.getPagination();
    this.userid = parseInt(localStorage.getItem('userid'));
  }
  getUserRoles() {
    this.userService.loadLiveRoles().subscribe((data: any) => {
      this.userRoles = [];
      if (data) {
        data.forEach((val, i) => {
          if (i == 0) {
            this.userRoles.push({ value: (val.id).toString(), label: val.roliname, selected: true });
          } else {
            this.userRoles.push({ value: (val.id).toString(), label: val.roliname });
          }
        });
      } else {
        this.userRoles = [];
      }
    });
  }
  getUserList() {
    this.userService.getUsersList().subscribe((data: any) => {
      if (data) {
        this.userList = data;
        this.isTableDataPresent = true;
      } else {
        this.isTableDataPresent = false;
      }
    });
  }

  openModal() {
    this.userForm.reset();
    this.basicModal.show();
    this.isUserExists = false;
    this.options = [
      { value: '1', label: 'Live' },
      { value: '2', label: 'Dormant' }
    ];
    this.userTypeOptions = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' }
    ];
    this.getUserRoles();

    this.isEditUser = false;
    this.user = {
      ...this.user,
      id: 0
    };
    setTimeout(() => {
      this.selectedValue = '1';
      this.selectedValue1 = this.userRoles[0].value;
      this.selectedValue2 = '1';
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
      return this.userList;
    }
    if (this.searchText) {
      return this.filterIt(this.userList, this.searchText);
    }
  }
  save() {
    if (this.user.id === 0) {
      this.user = {
        ...this.user,
        userid: this.userForm.value.userId,
        username: this.userForm.value.userName,
        nricno: this.userForm.value.nricno,
        usertype: this.userForm.value.userType,
        userrole: this.userForm.value.userRole,
        status12: this.userForm.value.status,
        crtmobile: this.userForm.value.mobile,
        email: this.userForm.value.email,
        Createby: this.userid,
        psw: this.userForm.value.password
      };
      this.createUser(this.user);
    } else if (this.user.id > 0) {
      this.user = {
        ...this.user,
        userid: this.userForm.value.userId,
        username: this.userForm.value.userName,
        nricno: this.userForm.value.nricno,
        usertype: this.userForm.value.userType,
        userrole: this.userForm.value.userRole,
        status12: this.userForm.value.status,
        crtmobile: this.userForm.value.mobile,
        email: this.userForm.value.email,
        modifyby: parseInt(this.userid),
        psw: this.userForm.value.password
      };
      this.updateUser(this.user);
    }
  }
  createUser(userForm) {
    this.userService.postUserData(userForm).subscribe((response: any) => {
      if (response && response.isSaved == "false") {
        this.isUserExists = true;
        this.errorMessage = response.message;
      } else {
        this.isUserExists = false;
        this.errorMessage = '';
        this.getUserList();
        this.basicModal.hide();
        this.getPagination();
      }
    });
  }

  editUser(item) {
    if (item) {
      this.isUserExists = false;
      this.userForm.pristine;
      this.userForm.setValue({
        userId: item.userid,
        userName: item.username,
        nricno: item.nricno,
        userType: (item.usertype).toString(),
        userRole: (item.userrole).toString(),
        status: (item.status12).toString(),
        mobile: item.crtmobile,
        email: item.email,
        password: item.psw
      });
      this.isEditUser = true;
      this.basicModal.show();
      this.user = item;
    }
    this.getUserRoles();

    this.options = [
      { value: '1', label: 'Live' },
      { value: '2', label: 'Dormant' }
    ];
    this.userTypeOptions = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' }
    ];
    setTimeout(() => {
      this.userRoles.forEach((val, i) => {
        if (val.label == item.userrole) {
          this.selectedValue1 = this.userRoles[i].value;
        }
      });
    console.log('asdas', this.userRoles);

    }, 200)

  }
  updateUser(user) {
    this.userService.updateUser(user).subscribe((data: any) => {
      if (data && data.isSaved == "false") {
        this.isUserExists = true;
        this.errorMessage = data.message;
      } else {
        const options = {
          progressBar: true,
          timeOut: 500,
          toastClass: 'black',
        };
        // this.toastService.success('User Updated Successfully', '', options);
        this.basicModal.hide();
        this.getUserList();
        this.getPagination();
      }

    });
  }

  deleteUser(item) {
    this.deletedItem = item;
    this.deleteModal.show();
  }
  deleteConfirm() {
    if (this.deletedItem) {
      this.userService.deleteUser(this.deletedItem).subscribe(data => {
        const options = {
          progressBar: true,
          timeOut: 500,
          toastClass: 'black',
        };
        // this.toastService.success('User Deleted Successfully', '', options);
        this.basicModal.hide();
        this.deleteModal.hide();
        this.getUserList();
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
