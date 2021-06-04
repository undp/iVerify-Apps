import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class InfoLogger extends Logger { }