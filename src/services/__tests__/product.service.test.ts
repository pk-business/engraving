import { describe, it, expect } from 'vitest';
import { mapStrapiToProduct } from '../product.service';

type StrapiPayload = Record<string, unknown>;

describe('mapStrapiToProduct', () => {
  it('maps flattened shape correctly', () => {
    const flat = {
      id: 123,
      name: 'Test Product',
      description: 'A product',
      price: 9.5,
      imageUrl: 'https://cdn.example.com/img.jpg',
      material: 'wood',
      occasions: ['birthday'],
      categories: ['gifts'],
      sizes: ['S', 'M'],
      inStock: true,
    } as StrapiPayload;

    const p = mapStrapiToProduct(flat);
    expect(p.id).toBe('123');
    expect(p.name).toBe('Test Product');
    expect(p.price).toBe(9.5);
    expect(p.imageUrl.main).toContain('img.jpg');
    expect(p.material).toBe('wood');
    expect(p.occasions).toContain('birthday');
  });

  it('maps nested strapi shape with featuredImage and gallery', () => {
    const nested = {
      id: 456,
      attributes: {
        name: 'Nested Product',
        price: 20,
        featuredImage: { data: { attributes: { url: '/uploads/feat.jpg' } } },
        gallery: { data: [{ attributes: { url: '/uploads/g1.jpg' } }, { attributes: { url: '/uploads/g2.jpg' } }] },
        material: { data: { attributes: { name: 'metal' } } },
        occasions: { data: [{ attributes: { name: 'wedding' } }] },
      },
    } as StrapiPayload;

    const p = mapStrapiToProduct(nested);
    expect(p.id).toBe('456');
    expect(p.imageUrl.main).toMatch(/uploads\/feat.jpg$/);
    expect(p.images.length).toBeGreaterThanOrEqual(2);
    expect(p.material).toBe('metal');
    expect(p.occasions).toContain('wedding');
  });
});
