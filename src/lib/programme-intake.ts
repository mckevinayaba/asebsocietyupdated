import type { Field } from './eoi';
import { conditions } from '@/content/framework';

export const circleGroups = [
  { title: 'Regions', field: 'regions', items: ['North', 'West', 'Central', 'East', 'Southern'].map(name => ({ key: `regional:${name}`, name: `${name} Africa` })) },
  { title: 'Working languages', field: 'languages', items: [{ key: 'language:en', name: 'English' }, { key: 'language:fr', name: 'French' }, { key: 'language:pt', name: 'Portuguese' }, { key: 'language:ar', name: 'Arabic' }] },
  { title: 'Peer working groups', field: 'groups', items: [{ key: 'group:hubs', name: 'Hub & accelerator leaders' }, { key: 'group:capital', name: 'Angel & seed investors' }, { key: 'group:university', name: 'University & technology transfer' }, { key: 'group:climate', name: 'Climate entrepreneurship builders' }, { key: 'group:policy', name: 'Ecosystem policy' }, { key: 'group:mentors', name: 'Mentors & programme practitioners' }, ...conditions.map(c => ({ key: `condition:${Number(c.n)}`, name: c.name }))] },
];
export const circleKeys = circleGroups.flatMap(group => group.items.map(item => item.key));
const common: Field[] = [
  { name: 'name', label: 'Your name or institution name', required: true },
  { name: 'email', label: 'Contact email', type: 'email', required: true },
  { name: 'country', label: 'Country you work from', type: 'country', required: true },
  { name: 'role', label: 'Your role or representative’s title', required: true },
  { name: 'organisation', label: 'Organisation or independent practice', required: true },
  { name: 'website', label: 'Website or social media handle', required: true, hint: 'https://… or @handle' },
  { name: 'operatingCountries', label: 'Countries where you operate', required: true },
  { name: 'focusAreas', label: 'Focus areas', required: true, minLength: 3 },
  { name: 'description', label: 'Who you are and your entrepreneurship ecosystem work', type: 'textarea', required: true, minLength: 80, hint: 'At least 80 characters: who you support, what you do and where.' },
];
export const programmeFields: Record<'/communities' | '/learning' | '/field-lab', Field[]> = {
  '/communities': [...common, ...circleGroups.map(group => ({ name: group.field, label: group.title, type: 'multiple' as const, options: group.items.map(item => item.key), optionLabels: Object.fromEntries(group.items.map(item => [item.key, item.name])), required: true }))],
  '/learning': [...common, { name: 'learningPriority', label: 'Your learning priorities', type: 'textarea', required: true }, { name: 'format', label: 'Preferred learning format', type: 'select', options: ['Online cohort', 'In-person masterclass', 'Blended learning'], required: true }],
  '/field-lab': [...common, { name: 'challenge', label: 'Ecosystem bottleneck or policy research question', type: 'textarea', required: true }, { name: 'outcomes', label: 'What would a useful result change for entrepreneurs?', type: 'textarea', required: true }, { name: 'partners', label: 'Potential delivery partners and resources', type: 'textarea', required: true }],
};
export type ProgrammeSource = keyof typeof programmeFields;
