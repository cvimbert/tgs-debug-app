import { Component, OnInit, Input } from '@angular/core';
import { GameBlockModel } from 'tgs-model';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {

  @Input("data") data: GameBlockModel;

  constructor() { }

  ngOnInit() {
  }

}
