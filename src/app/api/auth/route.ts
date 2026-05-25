import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { AuthResponse, AuthUser, ApiErrorResponse } from '@/lib/api-types';

// ─── Zod Validation Schemas ────────────────────────────────
const loginSchema = z.object({
  action: z.literal('login'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  action: z.literal('register'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

const authSchema = z.discriminatedUnion('action', [loginSchema, registerSchema]);

// ─── In-memory demo user store ─────────────────────────────
interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string; // In demo only — never do this in production!
  avatarUrl: string | null;
  createdAt: string;
}

const demoUsers: DemoUser[] = [
  {
    id: 'usr_demo_001',
    name: 'Demo User',
    email: 'demo@scanwise.app',
    password: 'demo123',
    avatarUrl: null,
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'usr_demo_002',
    name: 'Test User',
    email: 'test@scanwise.app',
    password: 'test123',
    avatarUrl: null,
    createdAt: '2025-02-01T14:30:00.000Z',
  },
];

// ─── Helper: Generate simple demo token ────────────────────
function generateDemoToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24h
    })
  ).toString('base64url');

  return `sw_demo_${payload}`;
}

// ─── Helper: Map DemoUser to AuthUser ──────────────────────
function toAuthUser(user: DemoUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

// ─── POST /api/auth ────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod discriminated union
    const validation = authSchema.safeParse(body);
    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: 'Invalid input',
        errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const data = validation.data;

    if (data.action === 'login') {
      // ─── Login Logic ──────────────────────────────────
      const user = demoUsers.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (!user || user.password !== data.password) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: 'Invalid email or password',
        };
        return NextResponse.json(errorResponse, { status: 401 });
      }

      const token = generateDemoToken(user.id);

      const response: AuthResponse = {
        success: true,
        user: toAuthUser(user),
        token,
        message: 'Login successful',
      };

      return NextResponse.json(response);
    }

    if (data.action === 'register') {
      // ─── Register Logic ───────────────────────────────
      const existingUser = demoUsers.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existingUser) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: 'An account with this email already exists',
        };
        return NextResponse.json(errorResponse, { status: 409 });
      }

      // Create new demo user
      const newUser: DemoUser = {
        id: `usr_${crypto.randomUUID().slice(0, 8)}`,
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };

      demoUsers.push(newUser);

      const token = generateDemoToken(newUser.id);

      const response: AuthResponse = {
        success: true,
        user: toAuthUser(newUser),
        token,
        message: 'Registration successful',
      };

      return NextResponse.json(response, { status: 201 });
    }

    // Should never reach here due to Zod discriminated union
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Unknown action',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  } catch (error) {
    console.error('[Auth API] Error:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: 'Internal server error during authentication',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
