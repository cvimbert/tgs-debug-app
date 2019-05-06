import { Component, OnInit } from '@angular/core';
import { TgsLoadingService } from 'src/app/game-structure/tgs-loading.service';
import { GameBlockModel } from 'tgs-model';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss']
})
export class GraphViewComponent implements OnInit {

  blocks: GameBlockModel[];

  constructor(
    private tgsService: TgsLoadingService
  ) { }

  ngOnInit() {
    this.blocks = this.tgsService.currentSequence.structureData.blocksArray;
  }



}
