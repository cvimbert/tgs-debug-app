import { Component, OnInit, Input } from '@angular/core';
import { TextUnit } from 'tgs-core';

@Component({
  selector: 'app-text-block-line',
  templateUrl: './text-block-line.component.html',
  styleUrls: ['./text-block-line.component.scss']
})
export class TextBlockLineComponent implements OnInit {

  @Input("unit") unit: TextUnit;

  constructor() { }

  ngOnInit() {
  }

}
