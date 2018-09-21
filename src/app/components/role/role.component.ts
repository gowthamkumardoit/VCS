import { NEW_STATUS } from './../../constants/common.constant';
import { ToastService } from 'ng-uikit-pro-standard';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';
import { RoleService } from '../../services/role.service';
import { UserRole } from '../../modals/role.modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  options: any = [];
  tableHeadings: any = [];
  tableData: any = [];
  isTableDataPresent: boolean;
  userRoles: UserRole[] = [];
  roleForm: FormGroup;
  role;
  defaultStatus = [];
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

  isEditRole: boolean;
  isRoleExists: boolean;
  errorMessage: string;
  userid: any;

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private el: ElementRef,
    private loginService: LoginService
  ) {
    this.getRolesList();

  }

  ngOnInit() {
    this.roleService.navigationBarShow.next(true);
    this.tableHeadings = [
      'No',
      'Role',
      'Status',
      'Created On',
      'Modified On',
      'Actions'
    ];
    this.isTableDataPresent = false;
    this.getPagination();
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.maxLength(40)]],
      status: [[Validators.required]]
    });

    this.role = {
      id: 0
    };
    this.defaultStatus = NEW_STATUS;
    this.userid = parseInt(localStorage.getItem('userid'));
  }



  getPagination() {
    setTimeout(() => {
      this.paginators = [];
      if (this.userRoles.length % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor(
          this.userRoles.length / this.itemsPerPage
        );
      } else {
        this.numberOfPaginators = Math.floor(
          this.userRoles.length / this.itemsPerPage + 1
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
      return this.userRoles;
    }
    if (this.searchText) {
      return this.filterIt(this.userRoles, this.searchText);
    }
  }
  getRolesList() {
    this.roleService.getRolesList().subscribe((data: any) => {
      if (data) {
        this.isTableDataPresent = true;
        this.userRoles = data;
      } else {
        this.userRoles = [];
        this.isTableDataPresent = false;
      }
    });
  }
  openModal() {

    this.roleForm.reset();
    this.basicModal.show();
    this.isRoleExists = false;
    this.options = [
      { value: '1', label: 'Live', selected: true },
      { value: '2', label: 'Dormant' }
    ];
    setTimeout(() => {
      this.selectedValue = '1';
    }, 200);
    this.isEditRole = false;
    this.role = {
      id: 0
    };
  }
  save() {
    if (this.role.id === 0) {
      this.createRoles(this.roleForm);
    } else if (this.role.id > 0) {
      this.role = {
        ...this.role,
        roliname: this.roleForm.value.roleName,
        status: this.roleForm.value.status,
        modifyby: this.userid  
      };
      this.updateRoles(this.role);
    }

  }
  createRoles(roleForm) {
    if (roleForm.valid) {
      this.role = {
        ...this.role,
        roliname: roleForm.value.roleName,
        status: roleForm.value.status,
        Createby: this.userid
      };
      this.roleService.createRole(this.role).subscribe((data: any) => {

        if (data && data.isSaved == "false") {
          this.isRoleExists = true;
          this.errorMessage = data.message;
        } else {
          this.isRoleExists = false;
          this.errorMessage = '';
          this.basicModal.hide();
          this.getPagination();
          const options = {
            progressBar: true,
            timeOut: 500,
            toastClass: 'black',
          };
          this.toastService.success('Role Added Successfully', '', options);
          this.getRolesList();
        }

      });
    }
  }

  editRole(item) {
    this.isRoleExists = false;
    if (item) {
      item = {
        ...item,
        status: (item.status).toString()
      };
      this.roleForm.setValue({
        status: item.status,
        roleName: item.roliname
      });
      this.basicModal.show();
      this.role = item;
    }
    this.options = [
      { value: '1', label: 'Live' },
      { value: '2', label: 'Dormant' }
    ];
    this.isEditRole = true;
    setTimeout(() => {
    }, 200);
  }
  updateRoles(roles) {
    this.roleService.updateRole(roles).subscribe((data: any) => {
      if (data && data.isSaved == "false") {
        this.isRoleExists = true;
        this.errorMessage = data.message;
      } else {
        this.getPagination();
        const options = {
          progressBar: true,
          timeOut: 500,
          toastClass: 'black',
        };
        this.toastService.success('Role Updated Successfully', '', options);
        this.basicModal.hide();
        this.getRolesList();
        this.isRoleExists = false;
      }
      
    });
  }

  deleteRole(item) {
    this.deletedItem = item;
    this.deleteModal.show();
  }
  deleteConfirm() {
    if (this.deletedItem) {
      this.roleService.deleteRole(this.deletedItem).subscribe(data => {
        const options = {
          progressBar: true,
          timeOut: 500,
          toastClass: 'black',
        };
        this.toastService.success('Role Deleted Successfully', '', options);
        this.basicModal.hide();
        this.deleteModal.hide();
        this.getRolesList();
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
