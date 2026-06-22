import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createPasswordResetEmail,
  createRegistrationConfirmationEmail,
} from './userEmails';

// Smoke tests for the transactional email builders.
//
// Why these exist: dashboard-core is shared across tenants (Yundera, NSL, ...).
// Twice now the brand identity has leaked into this layer — hardcoded "Yundera"
// strings and a logo loaded from disk that crashed the password-reset endpoint.
// These tests are the guardrail: they prove the builders (1) render without
// throwing, (2) take their brand from config rather than any hardcoded literal,
// and (3) only attach a logo when one is configured.

const BRAND_ENV_KEYS = ['BRAND_NAME', 'BRAND_DASHBOARD_URL', 'BRAND_LOGO_URL'] as const;

function clearBrandEnv() {
  for (const key of BRAND_ENV_KEYS) delete process.env[key];
}

describe('userEmails builders', () => {
  beforeEach(clearBrandEnv);
  afterEach(clearBrandEnv);

  it('renders the password reset email without throwing and includes the reset link', () => {
    const resetLink = 'https://example.test/reset?token=abc123';
    const msg = createPasswordResetEmail('user@example.test', resetLink);

    expect(msg.to).toBe('user@example.test');
    expect(msg.subject).toBe('Password Reset Request');
    expect(msg.html).toContain(resetLink);
    expect(msg.html.length).toBeGreaterThan(0);
    expect(msg.html).not.toContain('undefined');
  });

  it('renders the registration email without throwing', () => {
    const msg = createRegistrationConfirmationEmail('user@example.test', 'uid-42');

    expect(msg.to).toBe('user@example.test');
    expect(msg.html).toContain('uid-42');
    expect(msg.html).not.toContain('undefined');
  });

  it('takes the brand identity from config, with no hardcoded tenant literal', () => {
    // Sentinel brand values distinct from any real tenant, covering every place
    // identity surfaces (name + dashboard URL). If branding is wired to config
    // they appear; if anything is hardcoded, "yundera" leaks through.
    process.env.BRAND_NAME = 'AcmeCloud';
    process.env.BRAND_DASHBOARD_URL = 'https://dash.acme.test';

    const reset = createPasswordResetEmail('user@example.test', 'https://x.test/r');
    expect(reset.html).toContain('AcmeCloud');
    expect(reset.html).not.toMatch(/yundera/i);

    const reg = createRegistrationConfirmationEmail('user@example.test', 'uid-1');
    expect(reg.subject).toContain('AcmeCloud');
    expect(reg.html).toContain('AcmeCloud');
    expect(reg.text).toContain('AcmeCloud');
    expect(reg.html).not.toMatch(/yundera/i);
    expect(reg.text).not.toMatch(/yundera/i);
  });

  it('builds the registration link from the configured dashboard URL', () => {
    process.env.BRAND_DASHBOARD_URL = 'https://dash.acme.test';

    const reg = createRegistrationConfirmationEmail('user@example.test', 'uid-1');
    expect(reg.html).toContain('https://dash.acme.test#register');
  });

  it('omits the logo when no BRAND_LOGO_URL is configured', () => {
    const msg = createPasswordResetEmail('user@example.test', 'https://x.test/r');

    expect(msg.attachments ?? []).toEqual([]);
    expect(msg.html).not.toContain('<img');
  });

  it('references the configured logo URL (and does not inline an attachment)', () => {
    process.env.BRAND_LOGO_URL = 'https://cdn.acme.test/logo.png';

    const msg = createPasswordResetEmail('user@example.test', 'https://x.test/r');
    expect(msg.html).toContain('https://cdn.acme.test/logo.png');
    expect(msg.html).toContain('<img');
    expect(msg.attachments ?? []).toEqual([]);
  });
});
