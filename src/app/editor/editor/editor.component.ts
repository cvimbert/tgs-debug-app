import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  content: string = `/*fsdfsdfsdf*/
  //qsdqsd
  @init {
    main = 0;
    //son = 0;
  }

  #dsqdqsdq

	dqsdqsdsqdqs
  qsd/*qsdqsdqs*/
  dsqdqsdqs
  dsqdqsd
  qsdqsdqs
  qsdqdsqdqs
  
  qsdqsdqsdqsd
  
  //* sqdqsdsq -> #qsdsqdsq
  * Test -> #dsss
    
    
 #qsdsqdqs
 fdssdfsd
 fsdfsdfsd
 fsdfsdfsdf
 sdfsdfsdfsd
 
 * sdfsdf -> #sdqsdqsd
 * fdssdfsdf -> #sqdqsdqsd`;

  constructor() { }

  ngOnInit() {
  }

}
