import { Injectable } from '@angular/core';
import { GameSequence } from 'tgs-core';

@Injectable({
  providedIn: 'root'
})
export class TgsMainService {

  currentSequence: GameSequence;

  constructor() { }
}
