import { Component } from '@angular/core';
import { HeaderNoAutorizadoComponent } from '../../components/shared/header-no-autorizado/header-no-autorizado.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderNoAutorizadoComponent,FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  ngOnInit() {
    this.posicionarArriba();
  }

  posicionarArriba() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 40);
  }
  
}