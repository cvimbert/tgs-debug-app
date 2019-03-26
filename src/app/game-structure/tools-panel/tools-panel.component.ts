import { Component, OnInit } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';

@Component({
  selector: 'app-tools-panel',
  templateUrl: './tools-panel.component.html',
  styleUrls: ['./tools-panel.component.scss']
})
export class ToolsPanelComponent implements OnInit {

  constructor(
    private tgsService: TgsLoadingService
  ) { }

  ngOnInit() {
    
  }

  resetGame() {
    this.tgsService.resetGame();
  }

  inspectVariables() {
    
  }
}
