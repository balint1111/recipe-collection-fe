import { Component, OnInit } from '@angular/core';
import {RequestService} from "../../service/request.service";

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private requestService: RequestService) { }

  ngOnInit() {
    console.log('asd')
    this.requestService.get('http://localhost:8080')
    console.log('asd')
  }

}
