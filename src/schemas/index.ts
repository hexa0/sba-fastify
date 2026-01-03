import { z } from 'zod';

// /auth/handshake
export const HandshakeSchema = z.object({
  key: z.string().min(32),
  userId: z.coerce.number().int()
});


// POST /base/save?name=base_name
// The body is the raw buffer, so we only validate the query here.
export const BaseSaveQuerySchema = z.object({
    name: z.string().min(1).max(64),
});

// POST /unlockables/set
export const UnlockableSetSchema = z.object({
    userId: z.coerce.number().int(),
    name: z.string().min(1)
});

// GET /log/send
export const LogSendSchema = z.object({
    type: z.string().min(1),
    contents: z.string(), 
    adminName: z.string().optional()
});