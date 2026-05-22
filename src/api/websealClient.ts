const BASE_URL = (import.meta as any).env.VITE_BACKEND_URL 
  ? `${(import.meta as any).env.VITE_BACKEND_URL}/api`
  : '/api';

export interface VerdictResult {
  verdict: 'TRUE' | 'FALSE' | 'UNVERIFIABLE';
  confidence: number;
  reason: string;
}

export interface ClaimStatusResponse {
  intent_id: number;
  status: 'SUBMITTED' | 'ADJUDICATING' | 'SETTLED' | 'FAILED';
  claim: string;
  evidence_urls: string[];
  result: VerdictResult | null;
  submitted_at: number;
  settled_at: number;
  error?: string;
}

export const websealClient = {
  submitClaim: async (claim: string, urls: string[]) => {
    const res = await fetch(`${BASE_URL}/submit_claim`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify({ claim, urls }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => 'No response body');
      throw new Error(`Failed to submit claim: ${res.status} ${res.statusText} - ${errText}`);
    }
    return res.json();
  },
  
  adjudicateClaim: async (intent_id: number) => {
    const res = await fetch(`${BASE_URL}/adjudicate_claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent_id }),
    });
    if (!res.ok) throw new Error('Failed to start adjudication');
    return res.json();
  },
  
  pollStatus: async (intent_id: number): Promise<ClaimStatusResponse> => {
    const res = await fetch(`${BASE_URL}/get_claim/${intent_id}`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  }
};
