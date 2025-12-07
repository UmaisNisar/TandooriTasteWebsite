"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton({
  className
}: {
  className?: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/admin/login"
    });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className}
    >
      Logout
    </button>
  );
}

