import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthSession } from 'aws-amplify/auth';
import { catchError, EMPTY, from, Observable, switchMap } from 'rxjs';
import { CognitoService } from '../../services/cognito/cognito.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authJwtInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>, next:HttpHandlerFn) => {
    const cognitoService = inject(CognitoService)
    const router = inject(Router);

    return from(cognitoService.obtenerSesionAuth()).pipe(
        switchMap((session:AuthSession) => {
            if (!session.tokens) {
                router.navigate(['/login']);
                return EMPTY;
            }

            const modifiedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${session.tokens?.idToken?.toString()}`
                }
            });

            return next(modifiedReq);
        })
    );
};

