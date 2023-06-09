import { getSession } from "next-auth/react";

export default async function auth(req, res) {
  const session = await getSession({ req });

  if (session) {
    res.status(200).json({ session });
  } else {
    res.status(200).json({ session: null });
  }
}
