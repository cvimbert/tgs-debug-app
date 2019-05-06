import { Component, OnInit, Input } from '@angular/core';
import { GameBlockModel } from 'tgs-model';

@Component({
  selector: 'app-graph-view-block',
  templateUrl: './graph-view-block.component.html',
  styleUrls: ['./graph-view-block.component.scss']
})
export class GraphViewBlockComponent implements OnInit {

  @Input("block") block: GameBlockModel;

  constructor() { }

  ngOnInit() {
  }

}
