import { Injectable } from '@angular/core';
import { TGSParser, ParsingResult } from 'tgs-parser';
import { MainStructure } from 'tgs-model';
import { GameSequence } from 'tgs-core';

@Injectable({
  providedIn: 'root'
})
export class TgsLoadingService {

  constructor() { }

  loadFile(path: string): Promise<GameSequence> {

    return new Promise<GameSequence>((success: Function) => {

      let parser: TGSParser = new TGSParser();

      parser.loadTGSFile("assets/" + path + ".tgs").then((resp: ParsingResult) => {
        let structure: MainStructure = MainStructure.loadFromParsingResult(resp);
        let sequence = new GameSequence(structure);
        sequence.init();
        success(sequence);
      });
    });


  }
}
