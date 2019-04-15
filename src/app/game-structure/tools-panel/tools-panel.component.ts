import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tools-panel',
  templateUrl: './tools-panel.component.html',
  styleUrls: ['./tools-panel.component.scss']
})
export class ToolsPanelComponent implements OnInit {

  //variablesInspectorDisplay: boolean = true;
  displayedPanel = "variables";

  @Output("onClose") onClose: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private tgsService: TgsLoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  resetGame() {
    //this.close();
    this.tgsService.resetGame();
    this.close(false);
  }

  goToEditor() {
    this.router.navigate(["editor"], {
      queryParams: {
        path: "path/truc"
      }
    });
  }

  refresh() {
    this.tgsService.refreshGame();
    this.close();
  }

  close(refresh: boolean = true) {
    this.onClose.emit(refresh);
  }

  inspectVariables() {
    this.displayedPanel = "variables";
  }

  viewLogs() {
    this.displayedPanel = "logs";
  }

  goBack() {
    this.tgsService.goBack();
    this.close();
  }
}
