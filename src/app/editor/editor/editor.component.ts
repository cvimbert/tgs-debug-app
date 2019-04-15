import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  content: string;

  constructor() { }

  save() {
    localStorage.setItem("editor", this.content);
  }

  ngOnInit() {
    this.content = localStorage.getItem("editor");
  }

}
