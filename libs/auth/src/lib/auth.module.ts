import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/JwtAuthGuard.guard';

@NgModule({
  imports: [CommonModule],
  providers:[AuthService,JwtAuthGuard],
  exports:[AuthService]
})
export class AuthModule {}
