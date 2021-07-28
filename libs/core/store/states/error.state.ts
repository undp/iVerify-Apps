import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorState {
  error: HttpErrorResponse;
}

export const initialErrorState: ErrorState = {
  error: null
};
