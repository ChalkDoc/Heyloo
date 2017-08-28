import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { masterFirebaseConfig } from './api-keys';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { HostComponent } from './host/host.component';
import { StudentComponent } from './student/student.component';
import { RegisterComponent } from './register/register.component';
import { routing } from './app.routing';
import { StartComponent } from './start/start.component';
import { HostService } from './host.service';
import { StudentService } from './student.service';
import { BarGraphComponent } from './bar-graph/bar-graph.component';
import { ChartsModule } from 'ng2-charts';
import { HomeComponent } from './home/home.component';

export const firebaseConfig = {
  apiKey: masterFirebaseConfig.apiKey,
  authDomain: masterFirebaseConfig.authDomain,
  databaseURL: masterFirebaseConfig.databaseURL,
  storageBucket: masterFirebaseConfig.storageBucket
};

@NgModule({
  declarations: [
    AppComponent,
    HostComponent,
    StudentComponent,
    RegisterComponent,
    StartComponent,
    BarGraphComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    routing,
    ChartsModule
  ],
  providers: [StudentService, HostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
