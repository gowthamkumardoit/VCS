import { RoleService } from '../../services/role.service';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TemplateService } from '../../services/template.service';
import { ToastrService } from 'ngx-toastr';
import { TEMPLATE_BUTTONS } from './../../constants/common.constant';
declare var CKEDITOR: any;
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  myTemplate: any;
  newTemplate: any;
  searchText: string;
  templateList: any = [];
  tableHeadings: any = [];
  templateForm: FormGroup;
  isEditTemplate: boolean;
  isTemplateExists: boolean;
  errorMessage: string;
  items: any = [];
  userid: number;
  templateData: any;
  toastOptions: any;
  deletedItem: any;
  options: any = [];

  @ViewChild('basicModal') basicModal;
  @ViewChild('delete') deleteModal;
  selectedValue: string;
  @ViewChildren('pages') pages: QueryList<any>;
  itemsPerPage = 5;
  numberOfVisiblePaginators = 10;
  numberOfPaginators: number;
  paginators: Array<any> = [];
  activePage = 1;
  firstVisibleIndex = 1;
  lastVisibleIndex: number = this.itemsPerPage;
  firstVisiblePaginator = 0;
  lastVisiblePaginator = this.numberOfVisiblePaginators;
  constructor(private nav: RoleService, private fb: FormBuilder, private templateService: TemplateService,
    private toastService: ToastrService) { }

  ngOnInit() {
    this.tableHeadings = ['No', 'Template Name', 'Created On', 'Modified On', 'Actions'];
    this.newTemplate = '';
    this.templateForm = this.fb.group({
      templatehead: ['', [Validators.required, Validators.maxLength(40)]],
      status: ['', [Validators.required]],
    });
    CKEDITOR.replace('editor1');
    this.nav.navigationBarShow.next(true);
    this.nav.navigationBarShow.subscribe(data => {
      CKEDITOR.on('instanceReady', function () {
        CKEDITOR.document.getById('draggableList').on('dragstart', function (evt) {
          const target = evt.data.getTarget();
          CKEDITOR.plugins.clipboard.initDragDataTransfer(evt);
          const dataTransfer = evt.data.dataTransfer;
          dataTransfer.setData('text/html', target.getText());
        });
      });
    });

    this.items = TEMPLATE_BUTTONS;

    this.userid = Number(localStorage.getItem('userid'));
    this.templateData = {
      templatehead: '',
      templates: '',
      id: 0,
      createby: this.userid,
      status: 1,
      createon: new Date(),
    };
    this.toastOptions = {
      progressBar: true,
      timeOut: 1000,
      toastClass: 'black',
      closeButton: true
    };
    this.options = [
      { value: '1', label: 'Live', selected: true },
      { value: '2', label: 'Dormant' }
    ];
    this.getTemplateList();
    this.getPagination();
  }
  getTemplateList() {
    this.templateService.getTemplateList().subscribe((data) => {
      if (data) {
        this.templateList = data;
      } else {
        this.templateList = [];
      }
    });
  }
  openModal() {
    this.basicModal.show();
    this.templateForm.reset();
    CKEDITOR.instances['editor1'].setData('');
    this.isEditTemplate = false;
    this.isTemplateExists = false;
    this.templateData = {
      templatehead: '',
      templates: '',
      id: 0,
      createby: this.userid,
      status: 1,
      createon: new Date(),
    };
    this.options = [
      { value: '1', label: 'Live', selected: true },
      { value: '2', label: 'Dormant' }
    ];
    setTimeout(() => {
      this.selectedValue = '1';
    }, 200);
  }

  close() {
    this.basicModal.hide();
  }

  save() {
    if (this.templateData) {
      if (this.templateData.id === 0) {
        this.createTemplate();
      } else if (this.templateData.id > 0) {
        this.updateTemplate();
      }
    }
  }
  createTemplate() {
    const editor = CKEDITOR.instances.editor1;
    const getData = editor.getData();

    const postData = {
      ...this.templateData,
      templatehead: this.templateForm.value.templatehead,
      templates: getData,
      createby: this.userid,
      status: Number(this.templateForm.value.status),
    };
    this.templateService.postTemplateData(postData).subscribe((res: any) => {
      if (res && res.isSaved === 'false') {
        this.isTemplateExists = true;
        this.errorMessage = res.message;
      } else {
        this.isTemplateExists = false;
        this.errorMessage = '';
        this.basicModal.hide();
        this.toastService.success('Template Added Successfully', '', this.toastOptions);
        this.getTemplateList();
        this.getPagination();

      }
    });
  }
  editTemplate(item) {
    this.templateData = {
      ...this.templateData,
      ...item
    };
    setTimeout(() => {
      this.templateService.getDataById(item.id).subscribe((data: any) => {
        if (data) {
          this.newTemplate = data.message;
          CKEDITOR.instances['editor1'].setData(this.newTemplate);
        }
      });
    }, 300);
    this.basicModal.show();
    this.templateForm.patchValue({
      templatehead: item.templatehead,
      status: (item.status).toString()
    });
    this.isEditTemplate = true;
  }

  updateTemplate() {
    const editor = CKEDITOR.instances.editor1;
    const getData = editor.getData();

    const postData = {
      ...this.templateData,
      templatehead: this.templateForm.value.templatehead,
      templates: getData,
      modifyby: this.userid,
      status: 1,
      modifyon: new Date()
    };
    this.templateService.updateTemplateData(postData).subscribe((res: any) => {
      if (res && res.isSaved === 'false') {
        this.isTemplateExists = true;
        this.errorMessage = res.message;
      } else {
        this.isTemplateExists = false;
        this.errorMessage = '';
        this.basicModal.hide();
        this.getTemplateList();
        this.getPagination();
        this.toastService.success('Template Updated Successfully', '', this.toastOptions);
      }
    });
  }

  deleteTemplate(item) {
    this.deletedItem = item;
    this.deleteModal.show();
  }

  deleteConfirm() {
    if (this.deletedItem) {
      this.templateService.deleteTemplate(this.deletedItem).subscribe((res: any) => {
        this.deleteModal.hide();
        this.basicModal.hide();
        this.getTemplateList();
        this.getPagination();
        this.toastService.success('Template Deleted Successfully', '', this.toastOptions);
      });
    }
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
      return this.templateList;
    }
    if (this.searchText) {
      return this.filterIt(this.templateList, this.searchText);
    }
  }
  getPagination() {
    setTimeout(() => {
      this.paginators = [];
      if (this.templateList.length % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor(
          this.templateList.length / this.itemsPerPage
        );
      } else {
        this.numberOfPaginators = Math.floor(
          this.templateList.length / this.itemsPerPage + 1
        );
      }

      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }, 200);
  }
  // Pagination code
  changePage(event: any) {
    if (event.target.text >= 1 && event.target.text <= this.numberOfPaginators) {
      this.activePage = +event.target.text;
      this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
      this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    }
  }

  nextPage(event: any) {
    // if (this.pages.last.nativeElement.classList.contains('active')) {
    if (this.numberOfPaginators - this.numberOfVisiblePaginators >= this.lastVisiblePaginator) {
      this.firstVisiblePaginator += this.numberOfVisiblePaginators;
      this.lastVisiblePaginator += this.numberOfVisiblePaginators;
    } else {
      this.firstVisiblePaginator += this.numberOfVisiblePaginators;
      this.lastVisiblePaginator = this.numberOfPaginators;
    }
    // }

    this.activePage += 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  previousPage(event: any) {
    //  if (this.pages.first.nativeElement.classList.contains('active')) {
    if (this.lastVisiblePaginator - this.firstVisiblePaginator === this.numberOfVisiblePaginators) {
      this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
      this.lastVisiblePaginator -= this.numberOfVisiblePaginators;
    } else {
      this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
      this.lastVisiblePaginator -= this.numberOfPaginators % this.numberOfVisiblePaginators;
    }
    //  }

    this.activePage -= 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  firstPage() {
    this.activePage = 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    this.firstVisiblePaginator = 0;
    this.lastVisiblePaginator = this.numberOfVisiblePaginators;
  }

  lastPage() {
    this.activePage = this.numberOfPaginators;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;

    if (this.numberOfPaginators % this.numberOfVisiblePaginators === 0) {
      this.firstVisiblePaginator = this.numberOfPaginators - this.numberOfVisiblePaginators;
      this.lastVisiblePaginator = this.numberOfPaginators;
    } else {
      this.lastVisiblePaginator = this.numberOfPaginators;
      this.firstVisiblePaginator = this.lastVisiblePaginator - (this.numberOfPaginators % this.numberOfVisiblePaginators);
    }
  }
}
