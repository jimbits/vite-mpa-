import { Plugin } from 'vite';
import { existsSync, readdirSync, renameSync, rmdirSync } from 'fs';
import path from 'path';

/**
 * Custom Vite plugin to move HTML files from configured pages directory to dist root during build
 * Ensures all HTML files are accessible at the root level in production
 * @param pagesPath - Relative path to pages directory (required)
 */
export function flattenHtmlPlugin(pagesPath: string): Plugin {
  return {
    name: 'flatten-html',
    writeBundle(options, bundle) {
      const distDir = options.dir || 'dist';
      const srcPagesDir = path.join(distDir, pagesPath);

      if (existsSync(srcPagesDir)) {
        const htmlFiles = readdirSync(srcPagesDir).filter((file) =>
          file.endsWith('.html'),
        );

        htmlFiles.forEach((file) => {
          const srcPath = path.join(srcPagesDir, file);
          const destPath = path.join(distDir, file);

          // Move the file to dist root
          renameSync(srcPath, destPath);
          console.log(`✓ Moved ${file} from ${pagesPath} to dist root`);
        });

        // Clean up empty directories (walk up the path)
        try {
          const pathSegments = pagesPath.split('/');
          let currentDir = srcPagesDir;

          // Remove directories from deepest to shallowest
          for (let i = pathSegments.length - 1; i >= 0; i--) {
            try {
              rmdirSync(currentDir);
              console.log(
                `✓ Cleaned up empty directory: ${pathSegments.slice(0, i + 1).join('/')}`,
              );
              currentDir = path.dirname(currentDir);
            } catch (e) {
              // Directory not empty or doesn't exist, stop cleanup
              break;
            }
          }
        } catch (e) {
          console.log(
            'ℹ Could not remove some directories (they may not be empty)',
          );
        }
      } else {
        console.log(
          `ℹ No pages directory found at ${pagesPath} in build output`,
        );
      }
    },
  };
}

/**
 * Auto-detecting version of flattenHtmlPlugin
 * Uses the same detection logic as other auto functions
 */
export function flattenHtmlPluginAuto(): Plugin {
  return {
    name: 'flatten-html-auto',
    writeBundle(options, bundle) {
      const distDir = options.dir || 'dist';
      const commonPaths = [
        'src/pages',
        'src/views',
        'app/pages',
        'pages',
        'views',
        'templates',
      ];

      let foundPath: string | null = null;

      for (const pagesPath of commonPaths) {
        const srcPagesDir = path.join(distDir, pagesPath);
        if (existsSync(srcPagesDir)) {
          foundPath = pagesPath;
          break;
        }
      }

      if (!foundPath) {
        console.log(
          'ℹ No pages directory found in build output for flattening',
        );
        return;
      }

      console.log(`Auto-detected pages directory for flattening: ${foundPath}`);

      // Use the same logic as the explicit version
      const srcPagesDir = path.join(distDir, foundPath);
      const htmlFiles = readdirSync(srcPagesDir).filter((file) =>
        file.endsWith('.html'),
      );

      htmlFiles.forEach((file) => {
        const srcPath = path.join(srcPagesDir, file);
        const destPath = path.join(distDir, file);

        renameSync(srcPath, destPath);
        console.log(`✓ Moved ${file} from ${foundPath} to dist root`);
      });

      // Clean up empty directories
      try {
        const pathSegments = foundPath.split('/');
        let currentDir = srcPagesDir;

        for (let i = pathSegments.length - 1; i >= 0; i--) {
          try {
            rmdirSync(currentDir);
            console.log(
              `✓ Cleaned up empty directory: ${pathSegments.slice(0, i + 1).join('/')}`,
            );
            currentDir = path.dirname(currentDir);
          } catch (e) {
            break;
          }
        }
      } catch (e) {
        console.log(
          'ℹ Could not remove some directories (they may not be empty)',
        );
      }
    },
  };
}
