#!/usr/bin/env ts-node

import { execSync } from 'child_process';

import { bgRed, blue, green } from 'colors';
import { readdirSync } from 'fs-extra';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name.');
  process.exit(1);
}

const command = `npm run typeorm migration:create src/migrations/${ migrationName }`;

try {
  execSync(command, { stdio: 'inherit' });
  const generatedMigration = findGeneratedMigration(migrationName);
  const lintCreatedMigration = `npm run lint:fix src/migrations/${ generatedMigration }`;
  execSync(lintCreatedMigration, { stdio: null });
  console.log(green(`Migration ${ blue('linted') } successfully.`));
} catch (error) {
  console.error(bgRed.white('Error creating migration:'));
  console.error(error);
  process.exit(1);
}

function findGeneratedMigration(migrationName: string) {
  const migrationFolderContent = readdirSync('src/migrations');
  const migrationFile = migrationFolderContent.find((file) => file.endsWith(`-${ migrationName }.ts`));

  if (!migrationFile) {
    console.error('Could not find the generated migration file.');
    process.exit(1);
  }

  return migrationFile;
}
