import fs from 'fs';
import { generateUsers } from '../data/ai-data';

async function main() {
  const users = await generateUsers(5);
  fs.writeFileSync('test-data/users.json', JSON.stringify(users, null, 2));
  console.log(`Saved ${users.length} users to test-data/users.json - review before committing`);
}
main();
