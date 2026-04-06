import User from "@/src/models/User";
import { hashPassword } from "@/src/lib/auth-password";

let seedAttempted = false;

export async function ensureAdminSeeded() {
  if (seedAttempted) {
    return;
  }

  seedAttempted = true;

  const existingAdmin = await User.findOne({ role: "admin" }).lean();
  if (existingAdmin) {
    return;
  }

  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.warn("Admin seed skipped because ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD is missing.");
    return;
  }

  await User.create({
    name,
    email,
    passwordHash: hashPassword(password),
    role: "admin",
  });

  console.info(`Seeded default admin user: ${email}`);
}
