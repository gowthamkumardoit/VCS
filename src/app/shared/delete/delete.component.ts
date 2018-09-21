import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  @ViewChild('delete') deleteModal;
  @Output('deleteItems') deleteItems = new EventEmitter();
  @Input('item') item;
  constructor() { }

  ngOnInit() {
  }

  deleteConfirm() {
    this.deleteItems.emit({modal: this.deleteModal, deleted: true, item: this.item});
  }
}
