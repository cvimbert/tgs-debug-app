import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TgsLoadingService } from '../tgs-loading.service';
import { GameSequence, SequenceStructure } from 'tgs-core';
import { MainStructure } from 'tgs-model';

@Component({
  selector: 'app-debug-view',
  templateUrl: './debug-view.component.html',
  styleUrls: ['./debug-view.component.scss']
})
export class DebugViewComponent implements OnInit {

  currentId: string;
  sequence: GameSequence;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private loadingService: TgsLoadingService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentId = params["id"];
      this.loadingService.loadFile(this.currentId).then(sequence => {
        this.sequence = sequence;
        console.log(sequence);
        this.loaded = true;
      });
    })
  }

  get structure(): SequenceStructure {
    return this.sequence.sequence;
  }

  get data(): MainStructure {
    if (this.sequence) {
      return this.sequence.structureData;
    }
  }

}
