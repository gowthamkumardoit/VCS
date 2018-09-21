import { Component, OnInit} from '@angular/core';
import { RoleService } from '../../services/role.service';
declare var CKEDITOR: any;
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  myTemplate;
  constructor(private nav: RoleService) { }

  ngOnInit() {
    CKEDITOR.replace('editor1');
    this.nav.navigationBarShow.next(true);
    this.nav.navigationBarShow.subscribe(data => {
      CKEDITOR.on('instanceReady', function() {
        CKEDITOR.document.getById('draggableList' ).on( 'dragstart', function( evt ) {
          // const target = evt.data.getTarget().getAscendant( 'div', true );
          const target = evt.data.getTarget();
          CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );
          const dataTransfer = evt.data.dataTransfer;
        // dataTransfer.setData( 'contact', CONTACTS[ target.data( 'contact' ) ] );
          dataTransfer.setData( 'text/html', target.getText() );
        });
      });
    });

  }

  getData() {
    const editor = CKEDITOR.instances.editor1;
    alert(editor.getData());
  }

}
