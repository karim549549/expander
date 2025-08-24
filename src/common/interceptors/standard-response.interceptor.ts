import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { StandardResponse } from '../responses/standard-response';

@Injectable()
export class StandardResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If already wrapped, return as-is
        if (data instanceof StandardResponse) return data;

        const http = context.switchToHttp().getResponse();
        return new StandardResponse(data, 'Success', http.statusCode);
      }),
    );
  }
}
