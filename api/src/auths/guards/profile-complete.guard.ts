// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { UsersService } from '../../users/users.service';

// @Injectable()
// export class ProfileCompleteGuard implements CanActivate {
//   constructor(private readonly usersService: UsersService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user || !user.userId) {
//       throw new ForbiddenException('User not authenticated');
//     }

//     const result = await this.usersService.validateCompleteness(user.userId);

//     if (!result.isComplete) {
//       throw new ForbiddenException(
//         'Profile must be completed before accessing this resource. Please update your profile at /users/profile'
//       );
//     }

//     return true;
//   }
// }
