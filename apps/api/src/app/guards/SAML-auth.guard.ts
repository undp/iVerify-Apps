import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SAMLAuthGuard extends AuthGuard('saml') { }