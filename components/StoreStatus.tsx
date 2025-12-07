import { prisma } from "@/lib/prisma";

export default async function StoreStatus() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = now.getDay();

    // Check for holidays
    const holiday = await prisma.holiday.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (holiday) {
      if (holiday.isClosed) {
        return (
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/50 px-3 py-1.5 text-xs font-semibold text-red-200">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            Closed: {holiday.title}
          </div>
        );
      } else if (holiday.overrideOpenTime && holiday.overrideCloseTime) {
        const [openHour, openMin] = holiday.overrideOpenTime.split(":").map(Number);
        const [closeHour, closeMin] = holiday.overrideCloseTime.split(":").map(Number);
        const openTime = new Date(now);
        openTime.setHours(openHour, openMin, 0, 0);
        const closeTime = new Date(now);
        closeTime.setHours(closeHour, closeMin, 0, 0);
        if (closeTime < openTime) closeTime.setDate(closeTime.getDate() + 1);

        const isOpen = now >= openTime && now < closeTime;
        return (
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isOpen
                ? "bg-green-500/20 border-green-500/50 text-green-200"
                : "bg-red-500/20 border-red-500/50 text-red-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {isOpen ? "Open now" : "Closed"} · {holiday.title}
          </div>
        );
      }
    }

    // Get regular hours
    const hours = await prisma.storeHours.findUnique({
      where: { dayOfWeek }
    });

    if (!hours || hours.isClosed || !hours.openTime || !hours.closeTime) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/50 px-3 py-1.5 text-xs font-semibold text-red-200">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          Closed today
        </div>
      );
    }

    const [openHour, openMin] = hours.openTime.split(":").map(Number);
    const [closeHour, closeMin] = hours.closeTime.split(":").map(Number);
    const openTime = new Date(now);
    openTime.setHours(openHour, openMin, 0, 0);
    const closeTime = new Date(now);
    closeTime.setHours(closeHour, closeMin, 0, 0);
    if (closeTime < openTime) closeTime.setDate(closeTime.getDate() + 1);

    const isOpen = now >= openTime && now < closeTime;

    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
          isOpen
            ? "bg-green-500/20 border-green-500/50 text-green-200"
            : "bg-red-500/20 border-red-500/50 text-red-200"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isOpen ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {isOpen ? "Open now" : "Closed"} · {hours.openTime} - {hours.closeTime}
      </div>
    );
  } catch (error) {
    return null;
  }
}

