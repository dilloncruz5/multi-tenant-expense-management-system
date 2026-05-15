import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { authRepository } from '../repositories/auth.repository';
import { ConflictError, UnauthorizedError, BadRequestError } from '../utils/errors';
import { AuthPayload } from '../types';

const generateTokens = (payload: AuthPayload) => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

  const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

export class AuthService {
  async register(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const { user, org } = await userRepository.createOrganizationAndUser(
      { name: data.orgName },
      {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      }
    );

    const tokens = generateTokens({
      userId: user.id,
      orgId: org.id,
      role: user.role,
    });

    await authRepository.createRefreshToken({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: org.id,
      },
      ...tokens,
    };
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const tokens = generateTokens({
      userId: user.id,
      orgId: user.orgId,
      role: user.role,
    });

    await authRepository.createRefreshToken({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
      },
      ...tokens,
    };
  }

  async refresh(token: string) {
    const existingToken = await authRepository.findRefreshToken(token);
    if (!existingToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (existingToken.expiresAt < new Date()) {
      await authRepository.deleteRefreshToken(token);
      throw new UnauthorizedError('Refresh token expired');
    }

    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
      const decoded = jwt.verify(token, refreshSecret) as AuthPayload;

      const tokens = generateTokens({
        userId: decoded.userId,
        orgId: decoded.orgId,
        role: decoded.role,
      });

      // Token rotation
      await authRepository.deleteRefreshToken(token);
      await authRepository.createRefreshToken({
        token: tokens.refreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return tokens;
    } catch (err) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(token: string) {
    await authRepository.deleteRefreshToken(token);
  }
}

export const authService = new AuthService();
