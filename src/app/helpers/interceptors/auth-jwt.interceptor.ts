import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthSession } from 'aws-amplify/auth';
import { from, Observable, switchMap } from 'rxjs';
import { CognitoService } from '../../services/cognito/cognito.service';
import { inject } from '@angular/core';

export const authJwtInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>, next:HttpHandlerFn) => {
    const cognitoService = inject(CognitoService)

    return from(cognitoService.obtenerSesionAuth()).pipe(
        switchMap((session:AuthSession) => {
            const modifiedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${session.tokens?.idToken?.toString()}`
                }
            });

            return next(modifiedReq);
        })
    );
};

