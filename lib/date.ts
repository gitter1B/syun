import { formatInTimeZone } from "date-fns-tz";
import { Sales } from "./types";

export const getToday = async (): Promise<string> => {
  return formatInTimeZone(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
};

export function getDaysInMonth(year: number, month: number): number[] {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  const daysInMonth = new Date(year, month, 0).getDate();

  const days: number[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
}

export function stringDateToDate(stringDate: string): Date {
  const [year, month, day] = stringDate.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
}
export async function getYearChartData(
  salesData: Sales[],
  year: number
): Promise<{ month: string; price: number }[]> {
  const months: number[] = Array.from({ length: 12 }).map((_, i) => i + 1);
  return months.map((month) => {
    const monthData: Sales[] = salesData.filter((item) => {
      const date: Date = new Date(item.date);
      return year === date.getFullYear() && month === date.getMonth() + 1;
    });
    const price: number = monthData.reduce(
      (prev, cur) => prev + cur.unitPrice * cur.quantity,
      0
    );
    return {
      month: `${month}月`,
      price: price,
    };
  });
}

export async function getMonthChartData(
  salesData: Sales[],
  year: number,
  month: number
): Promise<{ day: string; price: number }[]> {
  const days: number[] = getDaysInMonth(year, month);
  return days.map((day) => {
    const dayData: Sales[] = salesData.filter((item) => {
      const date: Date = new Date(item.date);
      return (
        year === date.getFullYear() &&
        month === date.getMonth() + 1 &&
        day === date.getDate()
      );
    });
    const price: number = dayData.reduce(
      (prev, cur) => prev + cur.unitPrice * cur.quantity,
      0
    );
    return {
      day: `${day}日`,
      price: price,
    };
  });
}

export function convertDateTextToDateString(text: string): string {
  const match = text.match(/\d{4}年\d{2}月\d{2}日/);
  if (match) {
    const dateStr = match[0]
      .replace("年", "-")
      .replace("月", "-")
      .replace("日", "");
    return dateStr;
  } else {
    return "";
  }
}
