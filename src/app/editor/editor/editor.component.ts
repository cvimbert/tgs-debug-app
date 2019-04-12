import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  content: string = `#dsqdqsdq

	dqsdqsdsqdqs
    qsdqsdqsdqs
    
    * sqdqsdsq -> #qsdsqdsq
    
    
 #qsdsqdqs`;

  constructor() { }

  ngOnInit() {
  }

}
