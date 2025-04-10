import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardUsuarioComponent } from './pages/dashboard-usuario/dashboard-usuario.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ConfigurarPerfilComponent } from './pages/configurar-perfil/configurar-perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard-usuario', component: DashboardUsuarioComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'configurar-perfil', component: ConfigurarPerfilComponent },
  { path: '**', redirectTo: 'inicio' }
];