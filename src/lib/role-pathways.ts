import type { Role } from '@/content/field';
export function rolePathway(role: Role) {
  const group = role.constituency === 'support-institutions' ? 'group:hubs' : role.constituency === 'capital-market-builders' ? 'group:capital' : role.constituency === 'systems-builders' ? 'group:policy' : 'group:mentors';
  const condition = role.constituency === 'capital-market-builders' ? 'Capital Formation and Access' : role.constituency === 'systems-builders' ? 'Policy and Regulatory Environments' : role.constituency === 'support-institutions' ? 'Trust, Coordination and Data' : 'Talent and Capability Development';
  return { group, evidence: condition, registry: role.role };
}
