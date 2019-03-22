import { Injectable } from '@angular/core';
import { TGSParser, ParsingResult } from 'tgs-parser';
import { MainStructure } from 'tgs-model';
import { GameSequence } from 'tgs-core';
import { TgsMainService } from './tgs-main.service';
import { GameContext } from 'tgs-core/core/game-context.class';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService {

  constructor(
    private tgsService: TgsMainService
  ) {
    GameContext.init();
  }

  loadFile(path: string): Promise<GameSequence> {

    return new Promise<GameSequence>((success: Function) => {

      let parser: TGSParser = new TGSParser();

      parser.loadTGSFile("assets/tgs/" + path + ".tgs").then((resp: ParsingResult) => {
        let structure: MainStructure = MainStructure.loadFromParsingResult(resp);
        let sequence = new GameSequence(structure);
        sequence.init(path);
        this.tgsService.currentSequence = sequence;
        success(sequence);
      });
    });


  }
}
