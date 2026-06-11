#!/usr/bin/env node
/** gen-sitemap.js - demo-sales */
const path = require('path');
const { generateSitemap } = require('C:\\\\Users\\\\KillerGrowth\\\\.openclaw\\\\workspace\\\\tools\\\\kg-site-builder\\\\lib\\\\gen-sitemap');
const result = generateSitemap({ distDir: path.join(__dirname, 'dist'), siteRoot: __dirname, domain: 'demosalesinc.com' });
console.log('sitemap.xml generated — ' + result.count + ' URLs (demosalesinc.com)');
