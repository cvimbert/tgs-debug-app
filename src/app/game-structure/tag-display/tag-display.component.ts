import { Component, OnInit, Input } from '@angular/core';
import { TagModel } from 'tgs-model';

@Component({
  selector: 'app-tag-display',
  templateUrl: './tag-display.component.html',
  styleUrls: ['./tag-display.component.scss']
})
export class TagDisplayComponent implements OnInit {

  @Input("tag") tag: TagModel;

  constructor() { }

  ngOnInit() {
  }

}
