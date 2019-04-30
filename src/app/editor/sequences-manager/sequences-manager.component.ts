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
  selectedFile: string;

  @Output("navigation") navigation = new EventEmitter<string>();
  @Output("close") close = new EventEmitter<void>();

  constructor(
    private tgsService: TgsLoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setPathContent("");
  }

  setPathContent(path: string) {
    this.selectedFile = "";
    // console.log(path);
    this.currentPath = path;

    this.tgsService.getFolderContent(this.currentPath).then(items => {
      this.itemsList = items;

      this.folders = this.itemsList.filter(item => item.type === SequenceItemType.FOLDER).map(item => item.name);
      this.files = this.itemsList.filter(item => item.type === SequenceItemType.FILE).map(item => item.name);

      if (path !== "") {
        this.folders.unshift("..");
      }

      //console.log("items", this.itemsList, this.folders, this.files);
    });
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
    if (this.selectedFile != fileName) {
      this.selectedFile = fileName;
    } else {
      this.navigation.emit(this.getPath(fileName));
    }
  }

  getPath(fileName: string): string {
    return (this.currentPath !== "" ? (this.currentPath + "/") : "") + fileName;
  }

  deleteFile() {
    this.tgsService.deleteSequenceFile(this.getPath(this.selectedFile)).then(() => {
      this.setPathContent(this.currentPath);
    });
  }

  editSequence() {
    this.navigation.emit(this.getPath(this.selectedFile));
  }

  closeManager() {
    this.close.emit();
  }
}
