import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { ApiError } from '@app/models/api-error.model';

export const errorInterceptor: HttpInterceptorFn = (request, next) => next(request).pipe(
  catchError((error: HttpErrorResponse) => {
    const normalizedError: ApiError = {
      status: error.status,
      message: resolveErrorMessage(error),
      url: error.url ?? request.url,
      details: error.error,
    };

    return throwError(() => normalizedError);
  }),
);

function resolveErrorMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string' && error.error.trim().length > 0) {
    return error.error;
  }

  if (error.error && typeof error.error === 'object') {
    const message = 'message' in error.error ? error.error.message : undefined;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  if (error.status === 0) {
    return 'Nao foi possivel conectar com a MS-API. Verifique se o backend esta disponivel em http://localhost:8080.';
  }

  return error.message || 'Ocorreu um erro inesperado ao processar a requisicao.';
}
