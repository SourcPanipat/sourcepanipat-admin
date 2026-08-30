import { createClient } from '@libsql/client/web';

const TURSO_URL = process.env.NEXT_PUBLIC_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || 'libsql://sourcepanipat-sourcpanipat.aws-ap-south-1.turso.io';
const TURSO_TOKEN = process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODc5ODIyOTEsImlkIjoiMDFhMDRjMGMtNTkwMS03NjM5LTkzZWQtZWI2MTA3ZGU0YTY5Iiwia2lkIjoiZDIxY1lJdG9iMmFqSEU0R2ZRdEQyY1VQTXZzai1NcnhyZVBRVHI5WFpZUSIsInJpZCI6ImYzZDNiMzdmLTVlMmItNDlkYi1hMTc3LWQxYzJkN2NlZjNmYSJ9.Emfxh0Aqdcv77_R8j5CTPkKGweNSSt5sscmp08txsppH0dncNbyg87A8EZBgSBRMF8V2gaNoWlZiLMQazyU2DA';

export const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

export default turso;
