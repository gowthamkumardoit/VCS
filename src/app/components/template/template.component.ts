import { RoleService } from '../../services/role.service';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  isTemplateExists: boolean;
  errorMessage: string;
  items:any = [];

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
  constructor(private nav: RoleService, private fb: FormBuilder) { }

  ngOnInit() {
    this.tableHeadings = ['No', 'Template Name', 'Created On', 'Modified On', 'Actions'];
    this.newTemplate = "<p>Hello</p>";
    this.templateForm = this.fb.group({
      templateName: ['', [Validators.required, Validators.maxLength(40)]],
    });
    CKEDITOR.replace('editor1');
    this.nav.navigationBarShow.next(true);
    this.nav.navigationBarShow.subscribe(data => {
      CKEDITOR.on('instanceReady', function() {
        CKEDITOR.document.getById('draggableList' ).on( 'dragstart', function( evt ) {
          const target = evt.data.getTarget();
          CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );
          const dataTransfer = evt.data.dataTransfer;
          dataTransfer.setData( 'text/html', target.getText() );
        });
      });
    });

    this.items = ['Customer Name', 'Company Name', 'Company UEN', 'Email', 'Contact No', 'Customer Name', 'Company Name', 'Company UEN', 'Email', 'Contact No', 'Customer Name', 'Company Name', 'Company UEN', 'Email', 'Contact No'];

    this.templateList = [
      {templateName: 'First Template', createdOn: '20/10/2018', modifiedOn: '21/10/2018' }
    ];
    this.getPagination();
  }

  openModal() {
    this.basicModal.show();
    this.newTemplate = "<p>Hello</p>"
  }

  close() {
    this.basicModal.hide();
  }

  save() {
    const editor = CKEDITOR.instances.editor1;
    alert(editor.getData());
  }
  editTemplate(item) {
    this.basicModal.show();
    this.templateForm.patchValue({
      templateName : item.templateName
    });
  }

  deleteTemplate(item) {
    this.deleteModal.show();
  }

  deleteConfirm() {
    this.deleteModal.hide();
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
