import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Project Structure & Static Assets Validation', () => {
  const rootDir = process.cwd();

  describe('Core Pages Existence', () => {
    const requiredPages = [
      'src/pages/index.astro',
      'src/pages/about-us.astro',
      'src/pages/portfolio.astro',
      'src/pages/careers.astro',
      'src/pages/contact-us.astro',
      'src/pages/blog.astro',
      'src/pages/services/index.astro',
      'src/pages/services/brand-design.astro',
      'src/pages/services/social-media-marketing.astro',
      'src/pages/services/videography-photography.astro',
      'src/pages/services/web-development.astro',
      'src/pages/services/seo-optimization.astro',
      'src/pages/services/content-marketing.astro',
      'src/pages/terms.astro'
    ];

    it.each(requiredPages)('page %s should exist in repository', (relPath) => {
      const fullPath = path.join(rootDir, relPath);
      expect(fs.existsSync(fullPath)).toBe(true);
    });
  });

  describe('Public Favicon Assets', () => {
    it('public/favicon.ico and public/favicon.png must exist', () => {
      const faviconIco = path.join(rootDir, 'public', 'favicon.ico');
      const faviconPng = path.join(rootDir, 'public', 'favicon.png');
      expect(fs.existsSync(faviconIco)).toBe(true);
      expect(fs.existsSync(faviconPng)).toBe(true);
    });
  });

  describe('Section 04 Component Integrity (CampaignAnalytics.astro)', () => {
    it('should NOT contain the removed Production Editorial Queue or countdown elements', () => {
      const compPath = path.join(rootDir, 'src/components/CampaignAnalytics.astro');
      const content = fs.readFileSync(compPath, 'utf-8');

      expect(content.toLowerCase()).not.toContain('production editorial queue');
      expect(content.toLowerCase()).not.toContain('scheduled-pipeline-column');
      expect(content.toLowerCase()).not.toContain('pipeline-items-container');
      expect(content.toLowerCase()).not.toContain('queue');
    });

    it('should contain the balanced hall of fame dual grid and KPIs', () => {
      const compPath = path.join(rootDir, 'src/components/CampaignAnalytics.astro');
      const content = fs.readFileSync(compPath, 'utf-8');

      expect(content).toContain('hall-of-fame-wrapper');
      expect(content).toContain('media-duo-grid');
      expect(content).toContain('#1 MOST VIEWED REEL');
      expect(content).toContain('#1 MOST LIKED POST');
      expect(content).toContain('kpi-cards-grid');
      expect(content).toContain('studio-bottom-action-bar');
    });

    it('should NOT leak any forbidden client names in CampaignAnalytics.astro', () => {
      const compPath = path.join(rootDir, 'src/components/CampaignAnalytics.astro');
      const content = fs.readFileSync(compPath, 'utf-8').toLowerCase();

      const forbidden = ['beanery', 'velocita', 'aura'];
      for (const name of forbidden) {
        expect(content.includes(name)).toBe(false);
      }
    });
  });

  describe('Form Token Availability & Unavailable State Fallbacks', () => {
    it('src/pages/careers/[slug].astro should check isFormAvailable and provide unavailable-form fallback', () => {
      const filePath = path.join(rootDir, 'src/pages/careers/[slug].astro');
      const content = fs.readFileSync(filePath, 'utf-8');

      expect(content).toContain('isFormAvailable');
      expect(content).toContain('form-unavailable-card');
      expect(content).toContain('unavailable-badge');
      expect(content).toContain('mailto:Info@brandelier.in');
    });

    it('src/pages/contact-us.astro should check isFormAvailable and provide unavailable-form fallback', () => {
      const filePath = path.join(rootDir, 'src/pages/contact-us.astro');
      const content = fs.readFileSync(filePath, 'utf-8');

      expect(content).toContain('isFormAvailable');
      expect(content).toContain('form-unavailable-card');
      expect(content).toContain('unavailable-badge');
      expect(content).toContain('mailto:Info@brandelier.in');
    });
  });

  describe('Agent Readiness & Machine Discovery Validation', () => {
    it('public/robots.txt should declare Content-Signal directive', () => {
      const robotsPath = path.join(rootDir, 'public/robots.txt');
      const content = fs.readFileSync(robotsPath, 'utf-8');
      expect(content).toContain('Content-Signal: search=yes, ai-train=no');
    });

    it('public/llms.txt and public/llms-full.txt should exist and describe Brandelier', () => {
      const llmsPath = path.join(rootDir, 'public/llms.txt');
      const llmsFullPath = path.join(rootDir, 'public/llms-full.txt');
      expect(fs.existsSync(llmsPath)).toBe(true);
      expect(fs.existsSync(llmsFullPath)).toBe(true);

      const content = fs.readFileSync(llmsPath, 'utf-8');
      expect(content).toContain('# Brandelier Media Works');
      expect(content).toContain('/terms');
    });

    it('public/index.md and public/.htaccess should provide markdown representation & negotiation', () => {
      const mdPath = path.join(rootDir, 'public/index.md');
      const htaccessPath = path.join(rootDir, 'public/.htaccess');
      expect(fs.existsSync(mdPath)).toBe(true);
      expect(fs.existsSync(htaccessPath)).toBe(true);

      const htaccessContent = fs.readFileSync(htaccessPath, 'utf-8');
      expect(htaccessContent).toContain('text/markdown');
      expect(htaccessContent).toContain('Vary');
    });

    it('public/.well-known/mcp/server-card.json should exist and conform to SEP-1649', () => {
      const cardPath = path.join(rootDir, 'public/.well-known/mcp/server-card.json');
      expect(fs.existsSync(cardPath)).toBe(true);

      const card = JSON.parse(fs.readFileSync(cardPath, 'utf-8'));
      expect(card.name).toBe('brandelier-media-works');
      expect(card.version).toBe('1.0.0');
      expect(card.capabilities).toBeDefined();
      expect(card.capabilities.tools).toBeDefined();
    });

    it('src/layouts/Layout.astro should include complete Organization schema, sameAs links, and WebMCP tools', () => {
      const layoutPath = path.join(rootDir, 'src/layouts/Layout.astro');
      const content = fs.readFileSync(layoutPath, 'utf-8');

      expect(content).toContain('+91 70586 70837');
      expect(content).toContain('PostalAddress');
      expect(content).toContain('sameAs');
      expect(content).toContain('https://www.instagram.com/brandelier.in/');
      expect(content).toContain('registerTool');
      expect(content).toContain('modelContext');
    });

    it('src/components/Footer.astro should link to Terms of Service', () => {
      const footerPath = path.join(rootDir, 'src/components/Footer.astro');
      const content = fs.readFileSync(footerPath, 'utf-8');

      expect(content).toContain('/terms');
    });
  });
});

