import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HostComponent } from './host/host.component';
import { StudentComponent } from './student/student.component';
import { RegisterComponent } from './register/register.component';
import { StartComponent } from './start/start.component';
import { HomeComponent } from './home/home.component';
import { ChalkdocComponent } from './chalkdoc/chalkdoc.component';

const appRoutes: Routes = [
{
  path: '',
  component: HomeComponent
},
{
  path: 'start',
  component: StartComponent
},
{
  path: 'host/:roomCode',
  component: HostComponent
},
{
  path: 'student/:roomcode/:studentid',
  component: StudentComponent
},
{
  path: 'register',
  component: RegisterComponent
},
{
  path: 'chalkdoc/:id',
  component: ChalkdocComponent
}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
