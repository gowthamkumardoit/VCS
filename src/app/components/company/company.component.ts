import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'
import {
  NEW_STATUS, CUSTOMER_TYPE, BANK_CODE, CREDIT_TERMS, ACCOUNT_SUBGROUP, CURRENCY,
  SHARE_TYPE
} from './../../constants/common.constant';
import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Company } from './../../modals/company.modal';
import { Directors } from './../../modals/director.modal';
import { CompanyProfiles } from './../../modals/company-profiles.modal';
import { RoleService } from '../../services/role.service';
import { TabsetComponent } from 'ng-uikit-pro-standard';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  statusOptions: any = [];
  customTypeOptions: any = [];
  bankCodeOptions: any = [];
  creditTermsOptions: any = [];
  accountSubGroupOptions: any = [];
  currencyOptions: any = [];
  shareTypeOptions: any = [];
  tableHeadings: any = [];
  tableData: any = [];
  isTableDataPresent: boolean;
  companyForm: FormGroup;
  profileForm: FormGroup;
  directorForm: FormGroup;
  companyDataList: any = [];
  companyProfileList: any = [];
  directorList: any = [];

  @ViewChild('basicModal')
  basicModal;
  @ViewChild('delete')
  deleteModal;
  @ViewChild('deleteDirectorModal')
  deleteDirectorModal;
  companyData: Company;
  profileData: CompanyProfiles;
  directorData: Directors;
  directorDataArray: Directors[];
  companyUEN: string;
  toastOptions: any = {};
  DateGSTStatusVerified: any;
  OpeningBalanceDate: any;
  selectedValue1: string;
  selectedValue2: string;
  selectedValue3: string;
  selectedValue4: string;
  selectedValue5: string;
  currency1: string;
  status1: string;
  currency2: string;
  status2: string;
  profileStatus: string;
  directorStatus: string;

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
  searchText: string;
  today: any;
  directorHeadings: any = [];


  isEditCompany: boolean;
  isEditProfile: boolean;
  isEditDirector: boolean;
  isCompanyExists: boolean;
  isProfileExists: boolean;
  isDirectorExists: boolean;
  errorMessage: string;
  userid: any;
  defaultId: any;

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  constructor(private companyService: CompanyService, private fb: FormBuilder,
    private nav: RoleService, public datepipe: DatePipe,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.today = new Date();
    this.nav.navigationBarShow.next(true);
    this.userid = parseInt(localStorage.getItem('userid'));
    this.tableHeadings = ['No', 'Customer Name', 'Company Name', 'Company UEN', 'Customer GST No', 'Email', 'Actions'];
    this.directorHeadings = ['No', 'Director Name', 'Designation', 'Nationality', 'Shares', 'Action'];
    this.isTableDataPresent = false;
    this.statusOptions = [
      { value: '1', label: 'Live', selected: true },
      { value: '2', label: 'Dormant' }
    ];
    this.customTypeOptions = CUSTOMER_TYPE;
    this.bankCodeOptions = BANK_CODE;
    this.creditTermsOptions = CREDIT_TERMS;
    this.accountSubGroupOptions = ACCOUNT_SUBGROUP;
    this.currencyOptions = CURRENCY;
    this.shareTypeOptions = SHARE_TYPE;
    this.toastOptions = {
      progressBar: true,
      timeOut: 1000,
      toastClass: 'black',
      closeButton: true
    };



    this.initializeCompanyForm();
    this.initializeProfileForm();
    this.initializeDirectorForm();
    this.getCompanyList();
    this.getCompanyProfileList();
    this.getDirectorList();
    this.getPagination();
  }

  getPagination() {
    setTimeout(() => {
      this.paginators = [];
      if (this.companyDataList.length % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor(
          this.companyDataList.length / this.itemsPerPage
        );
      } else {
        this.numberOfPaginators = Math.floor(
          this.companyDataList.length / this.itemsPerPage + 1
        );
      }

      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }, 200);
  }
  openModal() {
    this.companyData = {
      ...this.companyData,
      id: 0
    };

    this.profileData = {
      ...this.profileData,
      id: 0
    };

    this.directorData = {
      ...this.directorData,
      id: 0
    };
    this.basicModal.show();
    this.isCompanyExists = false;
    this.isProfileExists = false;
    this.isDirectorExists = false;
    this.isEditCompany = false;
    this.isEditProfile = false;
    this.isEditDirector = false;
    // Initializing the default values
    this.statusOptions = [
      { value: '1', label: 'Live', selected: true },
      { value: '2', label: 'Dormant' }
    ];
    this.customTypeOptions = CUSTOMER_TYPE;
    this.bankCodeOptions = BANK_CODE;
    this.creditTermsOptions = CREDIT_TERMS;
    this.accountSubGroupOptions = ACCOUNT_SUBGROUP;
    this.currencyOptions = CURRENCY;
    this.shareTypeOptions = SHARE_TYPE;
    setTimeout(() => {
      this.companyForm.reset();
      this.profileForm.reset();
      this.directorForm.reset();
      this.initializeCompanyForm();
      this.initializeProfileForm();
      this.initializeDirectorForm();
      this.staticTabs.setActiveTab(1);

      this.companyForm.patchValue({
        DateGSTStatusVerified: new Date(),
        OpeningBalanceDate: new Date()
      });

      this.profileForm.patchValue({
        IncorporationDate: new Date(),
        Statusdate: new Date(),
        Dateofaddress: new Date(),
        DateoflastAGM: new Date(),
        DateoflastAR: new Date(),
        DateofAClaidatlastAGM: new Date(),
        DateoflodgementofARAC: new Date(),
      });

      this.directorForm.patchValue({
        doa: new Date(),
      });

      this.selectedValue1 = '1';
      this.selectedValue2 = '1';
      this.selectedValue3 = '1';
      this.selectedValue4 = '1';
      this.selectedValue5 = '1';
      this.currency1 = '1';
      this.currency2 = '1';
      this.status1 = '1';
      this.status2 = '1';
      this.profileStatus = '1';
      this.directorStatus = '1';

    }, 500);

    this.companyData = {
      ...this.companyData,
      id: 0
    };

    this.profileData = {
      ...this.profileData,
      id: 0
    };
  }


  getCompanyList() {
    this.companyService.getCompanyList().subscribe(data => {
      if (data) {
        console.log(data);
        this.companyDataList = data;
      } else {
        this.companyDataList = [];
      }
    });
  }

  getCompanyProfileList() {
    this.companyService.getCompanyProfilesList().subscribe(data => {
      if (data) {
        console.log('profile', data);
        this.companyProfileList = data;
      } else {
        this.companyProfileList = [];
      }
    });
  }

  getDirectorList() {
    this.companyService.getDirectorList().subscribe(data => {
      if (data) {
        this.directorList = data;
      } else {
        this.directorList = [];
      }
      this.directorDataArray = [];
      if (this.directorList.length > 0) {
        this.directorList.filter(val => {
          if (val.cmid === this.defaultId) {
            this.directorDataArray.push(val);
          }
        });
        if (this.directorDataArray.length > 0) {
          this.isEditDirector = true;
        } else {
          this.isEditDirector = false;
        }
      }
    });
  }

  save() {
    if (this.companyData.id === 0 || this.companyData === null) {
      this.createCompany();
    } else if (this.companyData.id > 0) {
      this.updateCompany();
    }
  }

  saveProfile() {
    if (this.profileData.id == 0) {
      this.createProfile();
    } else if (this.profileData.id > 0) {
      this.updateProfile();
    }
  }

  saveDirector() {
    // if (this.directorData['length'] === 0 || this.directorData.id === 0 || this.directorData.id === null) {
    this.createDirector();
    // } else if (this.directorData.id > 0) {
    // this.updateDirector();
    // }
  }

  createCompany() {
    const postData = {
      ...this.companyForm.value,
      Createby: this.userid,
    };
    this.companyService.createCompany(postData).subscribe((response: any) => {
      if (response && response.isSaved == "false") {
        this.isCompanyExists = true;
        this.errorMessage = response.message;
      } else {
        this.isCompanyExists = false;
        this.getCompanyList();
        this.getPagination();
        this.defaultId = (response.message).toString();
        this.profileForm.patchValue({
          cmid: response.message,
          CustomerUEN: this.companyForm.value.CustomerUEN,
          id: 0
        });
        this.directorForm.patchValue({
          cmid: response.message,
          CustomerUEN: this.companyForm.value.CustomerUEN,
          id: 0
        });
        this.toastService.success('Company Added Successfully', '', this.toastOptions);
        this.staticTabs.setActiveTab(2);
      }
    });
  }

  editCompany(item, i) {
    this.companyForm.pristine;
    this.profileForm.pristine;
    this.directorForm.pristine;
    this.isEditCompany = true;
    this.staticTabs.setActiveTab(1);
    this.companyData = item;
    this.companyForm.setValue({
      ...this.companyData,
      modifyby: parseInt(this.userid),
      Accountsubgr: (item.Accountsubgr).toString(),
      Status: (item.Status).toString(),
      custmmertype: (item.custmmertype).toString(),
      DateGSTStatusVerified: new Date(item.DateGSTStatusVerified),
      OpeningBalanceDate: new Date(item.OpeningBalanceDate),
    });
    this.today = new Date();
    this.defaultId = (item.id).toString();
    let tempProfiledata = [];

    if (this.companyProfileList.length > 0) {
      tempProfiledata = this.companyProfileList.filter(val => {
        return (parseInt(val.cmid) === item.id);
      });

      if (tempProfiledata !== undefined && tempProfiledata.length > 0) {
        setTimeout(() => {
          this.isEditProfile = true;
          this.profileForm.patchValue({
            ...tempProfiledata[0],
            IncorporationDate: new Date((tempProfiledata[0].IncorporationDate).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
            Statusdate: new Date((tempProfiledata[0].Statusdate).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
            Dateofaddress: new Date((tempProfiledata[0].Dateofaddress).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
            DateoflastAGM: new Date((tempProfiledata[0].DateoflastAGM).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
            DateoflastAR: new Date((tempProfiledata[0].DateoflastAR).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
            DateofAClaidatlastAGM: new Date((tempProfiledata[0].DateofAClaidatlastAGM).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
            DateoflodgementofARAC: new Date((tempProfiledata[0].DateoflodgementofARAC).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
            cmid: this.defaultId,
            CustomerUEN: item.CustomerUEN,
          });
          console.log('temp', tempProfiledata[0]);
          this.currency1 = (tempProfiledata[0].Currency).toString();
          this.currency2 = (tempProfiledata[0].Currency1).toString();
          this.status1 = (tempProfiledata[0].Sharetype).toString();
          this.status2 = (tempProfiledata[0].Sharetype1).toString();
          this.profileStatus = (tempProfiledata[0].Status).toString();
          this.directorForm.patchValue({
            cmid: this.defaultId,
            CustomerUEN: item.CustomerUEN,
            doa: new Date((tempProfiledata[0].DateoflodgementofARAC).replace(/-/g, '\/').replace(/T.+/, '')) || new Date(),
          });
          this.profileData = tempProfiledata[0];
          this.getDirectorList();
          console.log('update');
        }, 200);
      } else {
        console.log('update 1');
        this.noProfile(item);
        this.getDirectorList();
      }
    } else {
      console.log('update 2');
      this.noProfile(item);
      this.getDirectorList();
    }


    this.basicModal.show();
    this.statusOptions = NEW_STATUS;
    this.customTypeOptions = CUSTOMER_TYPE;
    this.bankCodeOptions = BANK_CODE;
    this.creditTermsOptions = CREDIT_TERMS;
    this.accountSubGroupOptions = ACCOUNT_SUBGROUP;
    this.currencyOptions = CURRENCY;
    this.shareTypeOptions = SHARE_TYPE;
  }

  noProfile(item) {
    this.profileData = {
      ...this.profileData,
      id: 0,
    }
    this.isEditProfile = false;
    setTimeout(() => {
      this.profileForm.patchValue({
        IncorporationDate: new Date(),
        Statusdate: new Date(),
        Dateofaddress: new Date(),
        DateoflastAGM: new Date(),
        DateoflastAR: new Date(),
        DateofAClaidatlastAGM: new Date(),
        DateoflodgementofARAC: new Date(),
        cmid: this.defaultId,
        CustomerUEN: item.CustomerUEN,
      });
      this.currency1 = '1';
      this.currency2 = '1';
      this.status1 = '1';
      this.status2 = '1';
      this.profileStatus = '1';
      this.directorStatus = '1';
      this.directorForm.patchValue({
        cmid: this.defaultId,
        CustomerUEN: item.CustomerUEN,
        doa: new Date(),
      });
    }, 200);
  }

  updateCompany() {
    const postData = {
      ...this.companyForm.value,
      DateGSTStatusVerified: new Date((this.companyForm.value.DateGSTStatusVerified)),
      OpeningBalanceDate: new Date((this.companyForm.value.OpeningBalanceDate)),
      modifyby: this.userid,
    };
    this.companyService.updateCompany(postData).subscribe((response: any) => {
      if (response && response.isSaved == "false") {
        this.isCompanyExists = true;
        this.errorMessage = response.message;
      } else {
        this.getCompanyList();
        this.getPagination();
        this.isCompanyExists = false;
        this.toastService.success('Company Updated Successfully', '', this.toastOptions);
        this.staticTabs.setActiveTab(2);
      }

    });
  }

  createProfile() {
    const postData = {
      ...this.profileForm.value,
      Createby: this.userid,
    };
    this.companyService.createProfile(postData).subscribe((data: any) => {
      if (data && data.isSaved == "false") {
        this.isProfileExists = true;
        this.errorMessage = data.message;
      } else {
        this.getCompanyList();
        this.toastService.success('Profile Added Successfully', '', this.toastOptions);
        this.staticTabs.setActiveTab(3);

      }
    });
  }

  updateProfile() {
    const postData = {
      ...this.profileForm.value,
      modifyby: parseInt(this.userid),
      Currency: parseInt(this.profileForm.value.Currency),
      Currency1: parseInt(this.profileForm.value.Currency1),
      Sharetype: parseInt(this.profileForm.value.Sharetype),
      Sharetype1: parseInt(this.profileForm.value.Sharetype1),
      Status: parseInt(this.profileForm.value.Status),
    };
    console.log(postData);
    this.companyService.updateProfile(postData).subscribe((data: any) => {
      if (data && data.isSaved == "false") {
        this.isProfileExists = true;
        this.errorMessage = data.message;
      } else {
        this.isProfileExists = false;
        this.getCompanyList();
        this.getCompanyProfileList();
        this.toastService.success('Profile Updated Successfully', '', this.toastOptions);
        this.staticTabs.setActiveTab(3);
      }
    });
  }

  createDirector() {
    const postData = {
      ...this.directorForm.value,
      Createby: this.userid,
    };
    this.companyService.createDirector(postData).subscribe((data: any) => {
      if (data && data.isSaved == "false") {
        this.isDirectorExists = true;
        this.errorMessage = data.message;
      } else {
        this.getCompanyList();
        this.getCompanyProfileList();
        this.getDirectorList();
        this.directorForm.reset();
        this.directorForm.patchValue({
          cmid: this.defaultId,
          doa: new Date(),
        });
        this.isDirectorExists = false;
        this.toastService.success('Director Added Successfully', '', this.toastOptions);
        this.directorStatus = '1';
      }
    });
  }

  deleteCompany(item, i) {
    this.deleteModal.show();
    this.companyData = { ...item, cmid: parseInt(item.cmid) };

    if (this.companyProfileList && this.companyProfileList[i]) {
      this.profileData = this.companyProfileList[i];
    }

    if (this.directorData && this.directorData[i]) {
      this.directorData = this.directorList[i];
    }
  }

  deleteCompanyConfirm() {
    this.companyService.deleteCompany(this.companyData).subscribe(data => {
      if (data) {
        this.deleteModal.hide();
        this.getCompanyList();
        this.getPagination();
        this.toastService.success('Company Deleted Successfully', '', this.toastOptions);
      }
    });
  }

  deleteDirector(item, i) {
    this.deleteDirectorModal.show();
    this.directorData = { ...item, cmid: parseInt(item.cmid) };
  }

  deleteDirectorConfirm() {
    this.companyService.deleteDirector(this.directorData).subscribe(data => {
      if (data) {
        this.deleteDirectorModal.hide();
        this.getDirectorList();
        this.toastService.success('Director Deleted Successfully', '', this.toastOptions);
      }
    });
  }

  initializeCompanyForm() {
    this.companyForm = this.fb.group({
      Accountsubgr: ['', Validators.required],
      BankCode: ['', Validators.required],
      BlockNo: ['', Validators.required],
      BuildingName: ['', Validators.required],
      ContactNo: ['', Validators.required],
      ContactPerson: ['', Validators.required],
      Country: ['', Validators.required],
      Createby: [''],
      Createon: [''],
      CreditLimit: ['', Validators.required],
      CustomerGSTNo: ['', Validators.required],
      CustomerName: ['', Validators.required],
      CustomerUEN: ['', Validators.required],
      DateGSTStatusVerified: ['', Validators.required],
      Email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      Fax: ['', Validators.required],
      FloorNo: ['', Validators.required],
      modifyby: [''],
      Modifieon: [''],
      OpeningBalanceDate: ['', Validators.required],
      PostalCode: ['', Validators.required],
      Status: ['', Validators.required],
      StreetName: ['', Validators.required],
      Telephone: ['', Validators.required],
      UnitNo: ['', Validators.required],
      Website: ['', Validators.required],
      closecredit: ['', Validators.required],
      companyname1: ['', Validators.required],
      creditterms: ['', Validators.required],
      custmmertype: ['', Validators.required],
      opcredit: ['', Validators.required],
      id: ['']
    });
  }

  initializeProfileForm() {
    this.profileForm = this.fb.group({
      id: [''],
      cmid: [''],
      Registrationno: ['', Validators.required],
      Companyname: ['', Validators.required],
      Formernameifany: ['', Validators.required],
      IncorporationDate: ['', Validators.required],
      CompanyType: ['', Validators.required],
      Status: ['', Validators.required],
      Statusdate: ['', Validators.required],
      Activities1: ['', Validators.required],
      Description1: ['', Validators.required],
      Activities2: ['', Validators.required],
      Description2: ['', Validators.required],
      Iscapital: ['', Validators.required],
      Noofshares: ['', Validators.required],
      Currency: ['', Validators.required],
      Sharetype: ['', Validators.required],
      Amount: ['', Validators.required],
      Pucapital: ['', Validators.required],
      Noofshares1: ['', Validators.required],
      Currency1: ['', Validators.required],
      Sharetype1: ['', Validators.required],
      Amount1: ['', Validators.required],
      ROaddress: ['', Validators.required],
      Dateofaddress: ['', Validators.required],
      DateoflastAGM: ['', Validators.required],
      DateoflastAR: ['', Validators.required],
      DateofAClaidatlastAGM: ['', Validators.required],
      DateoflodgementofARAC: ['', Validators.required],
      Createby: [''],
      Createon: [''],
      modifyby: [''],
      Modifieon: [''],
      CustomerUEN: ['']
    });
  }

  initializeDirectorForm() {
    this.directorForm = this.fb.group({
      directorname: ['', Validators.required],
      directorid: ['', Validators.required],
      designation: ['', Validators.required],
      nationality: ['', Validators.required],
      soadd: ['', Validators.required],
      noofsharedir: ['', Validators.required],
      cmid: [''],
      doa: ['', Validators.required],
      status: ['', Validators.required]
    });
  }
  // Pagination code

  filterIt(arr, searchKey) {
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        return obj[key] === null ? obj[key] : (obj[key]).toString().includes(searchKey);

      });
    });
  }

  search() {
    if (!this.searchText) {
      return this.companyDataList;
    }
    if (this.searchText) {
      return this.filterIt(this.companyDataList, this.searchText);
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
