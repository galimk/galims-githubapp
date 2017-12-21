import {Component, Input, OnInit} from '@angular/core';
import {GithubService} from "../../services/github.service";

@Component({
  selector: 'github-list',
  templateUrl: 'github-list.component.html',
  styleUrls: ['github-list.component.scss']
})

export class GithubListComponent implements OnInit {
  @Input()
  public listType: string;

  @Input() itemSelected: (item: any) => void;

  public orgName: string;

  public items = [];

  public busy: boolean;

  public config: any;

  private lastSeenId: number;

  constructor(private service: GithubService) {
  }

  ngOnInit() {
    let listConfig = this.getListConfigs();

    if (!listConfig[this.listType]) {
      throw `Invalid list type: ${this.listType}`;
    } else {
      this.config = listConfig[this.listType];
    }

    if (this.config.initLoad) {
      this.loadItems(null);
    }
  }

  public loadItems(orgName: string) {
    this.orgName = orgName;
    this.busy = true;
    this.config.loader(this.lastSeenId, this.orgName).subscribe((data) => {
      this.busy = false;
      for (let item of data) {
        this.items.push(item);
      }
      this.lastSeenId = data.length == 30 ? data[data.length - 1].id : null;
    })
  }

  public clearItems() {
    this.items = [];
    this.lastSeenId = null;
    this.orgName = null;
  }

  itemClicked(item) {
    if (this.itemSelected != null) {
      this.itemSelected(item);
    }
  }

  getListConfigs() {
    return {
      'organizations': {
        title: 'Organizations',
        initLoad: true,
        needOrg: false,
        loader: this.service.listOrganizations.bind(this.service)
      },
      'repositories': {
        title: 'Repositories',
        initLoad: false,
        needOrg: true,
        loader: this.service.listRepositories.bind(this.service)
      },
      'members': {
        title: 'Members',
        initLoad: false,
        needOrg: true,
        loader: this.service.listMembers.bind(this.service)
      }
    };
  }
}


