import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TgsLoadingService } from '../tgs-loading.service';
import { GameSequence, SequenceStructure } from 'tgs-core';
import { LinkModel } from 'tgs-model';

@Component({
  selector: 'app-main-structure',
  templateUrl: './main-structure.component.html',
  styleUrls: ['./main-structure.component.scss']
})
export class MainStructureComponent implements OnInit {

  tgsPath: string;
  sequence: GameSequence;
  structure: SequenceStructure;

  constructor(
    private route: ActivatedRoute,
    private loadingService: TgsLoadingService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tgsPath = params["id"];
      this.loadingService.loadFile(this.tgsPath).then((sequence: GameSequence) => {
        this.sequence = sequence;
        this.structure = sequence.sequence;
      });
    });
  }

  loadLink(link: LinkModel) {
    if (!link.globalLinkRef) {
      this.sequence.loadBlock(link.localLinkRef);
    } else {
      
    }
  }

}
