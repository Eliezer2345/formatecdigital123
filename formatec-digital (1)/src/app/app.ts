import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar} from './navbar';
import {Footer} from './footer';
import {Toast} from './toast';
import {MatIconModule} from '@angular/material/icon';
import { InactivityService } from './inactivity.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private inactivity = inject(InactivityService);

  ngOnInit() {
    this.inactivity.init();
  }
}
