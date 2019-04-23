import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TgsLoadingService } from 'src/app/game-structure/tgs-loading.service';
import { SequenceItem } from 'tgs-core';
import { SequenceItemType } from 'tgs-core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sequences-manager',
  templateUrl: './sequences-manager.component.html',
  styleUrls: ['./sequences-manager.component.scss']
})
export class SequencesManagerComponent implements OnInit {

  itemsList: SequenceItem[];
  folders: string[];
  files: string[];
  currentPath = "";

  @Output("navigation") navigation: EventEmitter<string> = new EventEmitter();

  constructor(
    private tgsService: TgsLoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setPathContent("");
  }

  setPathContent(path: string) {
    console.log(path);
    this.currentPath = path;
    this.itemsList = this.tgsService.getFolderContent(this.currentPath);
    console.log(this.itemsList);

    this.folders = this.itemsList.filter(item => item.type === SequenceItemType.FOLDER).map(item => item.name);
    this.files = this.itemsList.filter(item => item.type === SequenceItemType.FILE).map(item => item.name);

    if (path !== "") {
      this.folders.unshift("..");
    }
  }

  folderClick(folderName: string) {
    if (folderName === "..") {
      let index = this.currentPath.lastIndexOf("/");
      this.setPathContent(index === -1 ? "" : this.currentPath.substring(0, index));
    } else {
      this.setPathContent(this.currentPath + (this.currentPath === "" ? "" : "/") + folderName);
    }
  }

  fileClick(fileName: string) {
    this.navigation.emit(this.currentPath + "/" + fileName);
  }

}
