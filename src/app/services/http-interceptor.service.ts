import { Interceptor, InterceptedRequest, InterceptedResponse } from 'ng2-interceptors';
import { AuthService } from './auth.service';
import { BlockUIService } from './block-ui.service';
import { Inject } from '@angular/core';
import { MdSnackBar } from '@angular/material';

export class httpInterceptor implements Interceptor {

    constructor(@Inject(AuthService) private auth, @Inject(MdSnackBar) private snackBar, @Inject(BlockUIService) private blockUI){};

    public interceptBefore(request: InterceptedRequest): InterceptedRequest {
        this.blockUI.load();
        var token = this.auth.getToken();
        if(token) {
            request.options.headers.set('x-access-token',token);
        }
        return request;
    }

    public interceptAfter(response): InterceptedResponse {
        this.blockUI.stop();
        var jsonResponse = response.response.json();
        if(response.response.ok === false) {
            var message = jsonResponse.message;
            this.snackBar.open(message, 'Error', {duration: 5000});
        }
        if(response.response.status === 401) {
            this.auth.logout();
        }
        return response;
    }
}
