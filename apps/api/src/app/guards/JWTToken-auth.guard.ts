import { AuthGuard } from '@nestjs/passport';
import { CanActivate, Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
// import * as wp_auth from 'wp-auth';
// import { Observable } from 'rxjs';
@Injectable()
export class JWTTokenAuthGuard extends AuthGuard('jwt') { }
// export class JWTTokenAuthGuard implements CanActivate  {

//   private authOpts: any = {};
//   private handle: any;
//   constructor() {
//       this.authOpts = {
//         wpurl: 'https://iverify.org.zm',
//         logged_in_key: '|*V)9|ZDt%${QrXiGvA,9v|H|,n-&rytLo|{0l.+y`x!uftOqW]&d$O[@)SQ0Db.',
//         logged_in_salt: 's`P/)O-m(]q1h+dj)C2}/,8JQW9q$mELQ$oGrrib_:A,N9Y^:x`3s`||gh[F;j$1',
//         mysql_host: 'undphq10ds002.mysql.database.azure.com',
//         mysql_user: 'iverify@undphq10ds002',
//         mysql_pass: 'KKZ1pTyNiRbL',
//         mysql_port: '3306',
//         mysql_db: 'iverify',
//         wp_table_prefix: 'wp_' 
//       };
//       this.handle = wp_auth.create(this.authOpts);
//   }

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     this.handle.checkAuth( request ).on( 'auth', function( auth_is_valid, user_id ) {
//         console.log('==auth_is_valid');
//         console.log(auth_is_valid);
//     } );
//     return true;
//   }

//   // getAuth(req: any) {

//   //   req.headers.cookie
//   //   wp_auth.checkAuth( req ).on( 'auth', function( auth_is_valid, user_id ) {
//   //     auth_is_valid; // true if the user is logged in, false if they are not
//   //     user_id; // the ID number of the user or 0 if the user is not logged in
//   //   } );
//   // }

// }