import { Injectable, CanActivate, ExecutionContext, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { constant } from '../../constant/constant';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userData = request.user;
        const reqMethod = this.getRequestMethod(request);
        const reqUrl = this.getRequestUrl(request);
        if (!reqMethod || !reqUrl || !userData.id) throw new BadRequestException();

        if (userData && userData.roles) {
            const Roledata = userData.roles[0];
            const rolePermissionStatus = await this.roleHasPersmission(Roledata, reqUrl, reqMethod);
            if (rolePermissionStatus) {
                return true;
            } else {
                throw new ForbiddenException();
            }
        } else {
            throw new ForbiddenException();
        }
    }

    async roleHasPersmission(roleData, resource: string, method: string): Promise<boolean> {
        const resources = roleData.resource ? roleData.resource : null;
        const resourcesData = await this.parseOne(resources);
        console.log(method);
        console.log(resource);
        if (!resourcesData) return false;
        const resourcePermission = resourcesData.find(o => o && o.name && o.name.toLowerCase() === resource.toLowerCase());
        if (!(resourcePermission && resourcePermission.permissions)) return false;
        const rolePermission = resourcePermission.permissions;
        return rolePermission.includes(method);
    }



    async parseOne(string) {
        return await JSON.parse(string);
    }

    getRequestUrl(request) {
        if (request && request.url) {
            let reqUrl = request.url ? request.url.split('/')[1] : '';
            reqUrl = reqUrl ? reqUrl.split('?')[0] : '';
            return reqUrl ? constant.moduleMapping[reqUrl] : '';
        } else {
            return false;
        }
    }

    getRequestMethod(request) {
        if (request && request.url && request.method) {
            return request.method ? constant.HttpMethods[request.method] : '';
        } else {
            return false;
        }
    }
}