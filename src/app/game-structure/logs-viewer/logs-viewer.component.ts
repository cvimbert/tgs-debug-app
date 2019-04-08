import { Component, OnInit } from '@angular/core';
import { TgsLoadingService } from '../tgs-loading.service';
import { LogItem } from 'tgs-core';

@Component({
  selector: 'app-logs-viewer',
  templateUrl: './logs-viewer.component.html',
  styleUrls: ['./logs-viewer.component.scss']
})
export class LogsViewerComponent implements OnInit {

  constructor(
    private tgsService: TgsLoadingService
  ) { }

  ngOnInit() {
  }

  get logs(): LogItem[] {
    return this.tgsService.logs
  }

  logDate(item: LogItem): string {
    let date: Date = new Date(item.date);
    return date.toLocaleString();
  }

  deleteLog(index: number) {
    this.tgsService.deleteLog(index);
  }
}
