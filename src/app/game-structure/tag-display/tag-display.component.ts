import { Component, OnInit, Input } from '@angular/core';
import { TagModel } from 'tgs-model';

@Component({
  selector: 'app-tag-display',
  templateUrl: './tag-display.component.html',
  styleUrls: ['./tag-display.component.scss']
})
export class TagDisplayComponent implements OnInit {

  alignment: string[] = [];

  @Input("tag") tag: TagModel;

  constructor() { }

  ngOnInit() {
    if (this.tag.name === "img") {
      let align: string = this.tag.attributes["valign"];
      this.alignment = align ? ["valign-" + align] : [];
    }
  }

}
