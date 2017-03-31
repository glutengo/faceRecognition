import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material'
import { XHRBackend, RequestOptions } from '@angular/http';
import { MdSnackBar } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageModule } from 'angular-2-local-storage';
import { provideInterceptorService, InterceptorService } from 'ng2-interceptors';
import { routing } from './routing.module';

// components
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CameraSnapshotComponent } from './components/camera-snapshot/camera-snapshot.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { UpdateImageComponent } from './components/update-image/update-image.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { BlockUIComponent } from './components/block-ui/block-ui.component';

// services
import { httpInterceptor } from './services/http-interceptor.service';
import { AuthService } from './services/auth.service';
import { BlockUIService } from './services/block-ui.service';
import { UserRestService } from './services/user-rest.service';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, authService, snackbar, blockUI){
  let service = new InterceptorService(xhrBackend, requestOptions);
  service.addInterceptor(new httpInterceptor(authService, snackbar, blockUI));
  return service;
}

@NgModule({
  declarations: [ 
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    CameraSnapshotComponent,
    ImagePickerComponent,
    UpdateImageComponent,
    UpdatePasswordComponent,
    BlockUIComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    routing,
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
            prefix: 'faceRecognition',
            storageType: 'localStorage'
        })
  ],
  providers: [
    AuthService,
    BlockUIService,
    UserRestService,
    {
      provide: InterceptorService,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions, AuthService, MdSnackBar, BlockUIService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
