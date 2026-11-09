import { describe, expect, it } from 'vitest';
import { prepareEnquiry } from '@/lib/eoi';
import { programmeFields, circleKeys } from '@/lib/programme-intake';
import { rolePathway } from '@/lib/role-pathways';
import { roleBySlug } from '@/content/field';
const values = { name: 'Practice Collective', email: 'practice@example.com', country: 'Kenya', role: 'Hub leader', organisation: 'Practice Collective', website: 'https://example.com', operatingCountries: 'Kenya and Rwanda', focusAreas: 'Climate entrepreneurship', description: 'We support entrepreneurship ecosystem builders through founder mentoring, climate enterprise programmes and regional collaboration.', regions: 'regional:East', languages: 'language:en', groups: 'group:climate' };
describe('Connected programme intake', () => {
 it('requires consent for public Circle preferences', () => expect(() => prepareEnquiry('/communities', programmeFields['/communities'], values, false)).toThrow());
 it('requires a region, language and working group', () => { for (const key of ['regions', 'languages', 'groups']) expect(() => prepareEnquiry('/communities', programmeFields['/communities'], { ...values, [key]: '' }, true)).toThrow(); });
 it('accepts climate working groups and English', () => { expect(circleKeys).toContain('group:climate'); expect(circleKeys).toContain('language:en'); expect(prepareEnquiry('/communities', programmeFields['/communities'], values, true)).toMatchObject({ source_page: '/communities', inquiry_type: 'circle_preferences', status: 'pending' }); });
 it('rejects unknown Circle keys', () => expect(() => prepareEnquiry('/communities', programmeFields['/communities'], { ...values, groups: 'group:admin' }, true)).toThrow());
 it('requires full work details with at least 80 characters', () => { expect(() => prepareEnquiry('/communities', programmeFields['/communities'], { ...values, description: 'x'.repeat(79) }, true)).toThrow(); expect(() => prepareEnquiry('/communities', programmeFields['/communities'], { ...values, description: 'x'.repeat(80) }, true)).not.toThrow(); });
 it('requires a website or social handle', () => { expect(() => prepareEnquiry('/communities', programmeFields['/communities'], { ...values, website: '' }, true)).toThrow(); expect(() => prepareEnquiry('/communities', programmeFields['/communities'], { ...values, website: '@climatebuilders' }, true)).not.toThrow(); });
 it('keeps Academy interest distinct from research enquiries', () => { expect(prepareEnquiry('/learning', programmeFields['/learning'], { ...values, learningPriority: 'Mentoring standards', format: 'Online cohort' }, true).inquiry_type).toBe('academy_interest'); expect(prepareEnquiry('/field-lab', programmeFields['/field-lab'], { ...values, challenge: 'Climate founder finance', outcomes: 'Better access to capital', partners: 'University and hubs' }, true).inquiry_type).toBe('research_enquiry'); });
 it('connects hub roles to hub working groups', () => { const role = roleBySlug('innovation-hub'); if (!role) throw new Error('Missing hub role'); expect(rolePathway(role).group).toBe('group:hubs'); });
});
