import * as jwt from 'jsonwebtoken';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
@Injectable()
export class AuthService {
  async createSubmitStoryToken() {
    const payload = {
      timestamp: Date.now(),
    };
    const expiresIn = process.env.SUBMIT_STORY_TOKEN_EXPIRE_TIME || '30m';
    const accessToken = jwt.sign(payload, process.env.SECRET_ENV, {
      expiresIn,
    });
    return accessToken;
  }

  async validateSubmitStoryToken(token: string): Promise<any> {
    try {
      // Decode and verify the token
      const decoded:any = jwt.verify(token, process.env.SECRET_ENV);

      // Optional: Check timestamp for specific requirements
      const currentTime = Date.now();
      const tokenTime = decoded.timestamp;
      const timeDifference = currentTime - tokenTime;

      if (timeDifference > 30 * 60 * 1000) {
        // 30 minutes in milliseconds
        return false
      }

      // Process form data here as token is valid
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
