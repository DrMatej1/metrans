import { Component } from '@angular/core';
import {AppModule} from "./app.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'metrans';
}
