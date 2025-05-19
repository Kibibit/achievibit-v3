import { join } from "path";
import { injectThemes } from "./inject-themes";

export default async function globalTeardown() {
  await injectThemes(
    join(__dirname, '../../test-results'),
    'achievibit-backend'
  );
}