import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { LEADERS } from '../shared/leaders'
import { LeaderService} from '../services/leader.service';
import { Leader } from '../shared/leader';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leader: Leader[];

  constructor(private leaderservice: LeaderService,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.leader = this.leaderservice.getLeaders();
  }

}
