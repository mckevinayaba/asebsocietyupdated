import type { Role } from '@/content/field';
export function rolePathway(role: Role) {
  const group = role.constituency === 'support-institutions' ? 'group:hubs' : role.constituency === 'capital-market-builders' ? 'group:capital' : role.constituency === 'systems-builders' ? 'group:policy' : 'group:mentors';
  const condition = role.constituency === 'capital-market-builders' ? 'Finance' : role.constituency === 'systems-builders' ? 'Governance' : role.constituency === 'support-institutions' ? 'Support' : 'Human Capital';
  return { group, evidence: condition, registry: role.role };
}
