import { resolve, dirname, basename } from "path";
import { globSync } from "glob";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

/**
 * Find the project root directory by looking for package.json
 * @param startPath - Starting directory path
 * @returns Absolute path to project root
 */
function findProjectRoot(startPath: string): string {
  let currentPath = startPath;

  while (currentPath !== dirname(currentPath)) {
    if (existsSync(resolve(currentPath, "package.json"))) {
      return currentPath;
    }
    currentPath = dirname(currentPath);
  }

  // Fallback if package.json not found
  throw new Error("Could not find project root (package.json not found)");
}

/**
 * Get the project root directory
 * @returns Absolute path to project root
 */
export function getProjectRoot(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return findProjectRoot(__dirname);
}

/**
 * Get a directory path relative to project root
 * @param relativePath - Path relative to project root (e.g., 'src/pages')
 * @returns Absolute path to the directory
 */
export function getProjectPath(relativePath: string): string {
  const rootDir = getProjectRoot();
  return resolve(rootDir, relativePath);
}

/**
 * Get the pages directory path
 * @param pagesPath - Relative path to pages directory (required)
 * @returns Absolute path to pages directory
 */
export function getPagesDir(pagesPath: string): string {
  const fullPath = getProjectPath(pagesPath);

  if (!existsSync(fullPath)) {
    throw new Error(
      `Pages directory does not exist: ${pagesPath} (resolved to: ${fullPath})`,
    );
  }

  return fullPath;
}

/**
 * Auto-detect common pages directories
 * @returns First existing pages directory or null if none found
 */
export function detectPagesDir(): string | null {
  const commonPaths = [
    "src/pages",
    "src/views",
    "app/pages",
    "pages",
    "views",
    "templates",
  ];

  for (const path of commonPaths) {
    const fullPath = getProjectPath(path);
    if (existsSync(fullPath)) {
      return path;
    }
  }

  return null;
}

/**
 * Builds the pages configuration object for Vite multi-page setup
 * @param pagesPath - Relative path to pages directory (required)
 * @param indexFile - Relative path to index file (default: 'index.html')
 * @returns Record of page names to file paths
 */
function buildPagesConfig(
  pagesPath: string,
  indexFile: string = "index.html",
): Record<string, string> {
  const rootDir = getProjectRoot();
  const pagesDirectory = getProjectPath(pagesPath);

  // Validate that the pages directory exists
  if (!existsSync(pagesDirectory)) {
    throw new Error(`Pages directory does not exist: ${pagesPath}`);
  }

  // Object to store all pages in the project
  const pages: Record<string, string> = {};

  // Add index.html to the pages object
  const indexPath = resolve(rootDir, indexFile);
  if (!existsSync(indexPath)) {
    throw new Error(`Index file does not exist: ${indexFile}`);
  }
  pages.index = indexPath;

  // Find all HTML pages in the specified pages directory
  const htmlPages = globSync("*.html", { cwd: pagesDirectory });

  htmlPages.forEach((file) => {
    const name = basename(file, ".html");
    pages[name] = resolve(pagesDirectory, file);
  });

  return pages;
}

/**
 * Builds pages config with auto-detection fallback
 * @param pagesPath - Optional relative path to pages directory
 * @param indexFile - Relative path to index file (default: 'index.html')
 * @returns Record of page names to file paths
 */
function buildPagesConfigAuto(
  pagesPath?: string,
  indexFile: string = "index.html",
): Record<string, string> {
  let actualPagesPath = pagesPath;

  if (!actualPagesPath) {
    const detected = detectPagesDir();
    if (!detected) {
      throw new Error(
        "Could not find pages directory. Please specify the path explicitly.\n" +
          "Searched for: src/pages, src/views, app/pages, pages, views, templates",
      );
    }
    actualPagesPath = detected;
    console.log(`Auto-detected pages directory: ${actualPagesPath}`);
  }

  return buildPagesConfig(actualPagesPath, indexFile);
}

export { buildPagesConfig, buildPagesConfigAuto };
