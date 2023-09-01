import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../backend/tRPC/server/index.ts';

export const trpc = createTRPCReact<AppRouter>();