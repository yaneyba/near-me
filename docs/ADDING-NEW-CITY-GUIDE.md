# Adding a New City and Its Businesses

This guide explains how to add a new city and its businesses to the Near Me directory project, ensuring proper integration with the data, subdomain HTML generation, and sitemap generation systems.

## 1. Prepare Business Data
- Gather all business information for the new city (name, address, phone, website, category, services, hours, etc.).
- Normalize the data: use consistent field names and formats as in existing entries.
- Assign unique, sequential IDs using the pattern `<category>-<city>-XX` (e.g., `nail-salons-houston-01`). Use two digits for the number.
- Ensure no duplicate businesses (compare by name, address, and city).

## 2. Update `businesses.json`
- Add the new business objects to the `src/data/businesses.json` array.
- Place them in the correct order (sorted by `id` is recommended).
- Validate the JSON file for syntax errors.

## 3. Update City-State Mapping
- Update the city-state mapping in both of these files:
  - `scripts/generate-subdomain-html.js`
  - `src/utils/sitemapGenerator.ts`
- In each file, add the new city to the mapping object:
  ```js
  // Example for JS/TS
  const cityStateMap = {
    // ...existing cities...
    'newcity': 'StateName'
  };
  ```

## 4. Generate Subdomain HTML
- Run the HTML generation script:
  ```sh
  node scripts/generate-subdomain-html.js
  ```
- The script will:
  - Detect all unique category/city combinations.
  - Generate an HTML file for each combination in the `dist/` directory.
  - Create/update `subdomain-mapping.json` for deployment.

## 5. (Optional) Add City/Category-Specific Assets
- If you want a custom Open Graph image for the new city/category, add `/public/og-<category>.png`.

## 6. Build and Deploy
- Run your build and deployment process as usual.
- The new city and its businesses will be included in the generated subdomain HTML and mapping files.

## 7. Validate
- Check the generated HTML files in `dist/`.
- Confirm the new city appears as expected on the site.
- Check that the new city and state appear correctly in generated sitemaps and robots.txt.

---

**Summary:**
1. Add and normalize new businesses in `businesses.json`.
2. Update the city-state map in both the HTML and sitemap generator scripts.
3. Run the HTML generator.
4. Deploy as usual.

This process ensures new cities and their businesses are fully integrated and discoverable in the directory, subdomain, and sitemap systems.
