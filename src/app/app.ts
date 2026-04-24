import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@app/components/footer/footer.component';
import { NavbarComponent } from '@app/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
