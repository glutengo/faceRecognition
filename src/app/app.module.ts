import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material'
import { XHRBackend, RequestOptions } from '@angular/http';
import { MdSnackBar } from '@angular/material';
import { LocalStorageModule } from 'angular-2-local-storage';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { routing } from './routing/routing.module';
import { HomeComponent } from './home/home.component';

import { provideInterceptorService, InterceptorService } from 'ng2-interceptors';
import { httpInterceptor } from './http-interceptor.service';
import { AuthService } from './auth.service';
import { CameraSnapshotComponent } from './camera-snapshot/camera-snapshot.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpdateImageComponent } from './update-image/update-image.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { BlockUIComponent } from './block-ui/block-ui.component';
import { BlockUIService } from './block-ui.service';

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
    {
      provide: InterceptorService,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions, AuthService, MdSnackBar, BlockUIService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
