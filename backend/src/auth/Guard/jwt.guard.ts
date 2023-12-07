import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// console.log('JwtGuard');
		const client = context.switchToWs().getClient();
		const token = client.handshake.query.user;
		// console.log('token:', client.handshake.query)
		if (!token) {
			return false;
		}
		try {
			const user = token
			console.log('user',user);
			if (!user) {
				return false;
			}
			client.user = user;
			return true;
		}
		catch (error) {
			return false;
		}
	}
}