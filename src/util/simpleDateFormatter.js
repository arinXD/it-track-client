"use client"
import { format } from 'date-fns';

const months = {
     "01": 'มกราคม',
     "02": 'กุมภาพันธ์',
     '03': 'มีนาคม',
     "04": 'เมษายน',
     "05": 'พฤษภาคม',
     "06": 'มิถุนายน',
     "07": 'กรกฎาคม',
     '08': 'สิงหาคม',
     "09": 'กันยายน',
     "10": 'ตุลาคม',
     "11": 'พฤศจิกายน',
     "12": 'ธันวาคม',
}
const monthsY = {
     "01": 'ม.ค.',
     "02": 'ก.พ.',
     '03': 'มี.ค.',
     "04": 'เม.ย.',
     "05": 'พ.ค.',
     "06": 'มิ.ย.',
     "07": 'ก.ค.',
     '08': 'ส.ค.',
     "09": 'ก.ย.',
     "10": 'ต.ค.',
     "11": 'พ.ย.',
     "12": 'ธ.ค.',
}

function getDateProperty(date) {
     try {
          const parsedDate = new Date(date);

          const day = format(parsedDate, 'dd');
          const month = format(parsedDate, 'MM');
          const thaiMonth = months[month];
          const thaiMonthY = monthsY[month];
          const defYear = parsedDate.getFullYear()
          const year = parsedDate.getFullYear() + 543;
          const hours = format(parsedDate, 'HH');
          const minutes = format(parsedDate, 'mm');

          return {
               day,
               month,
               thaiMonth,
               thaiMonthY,
               defYear,
               year,
               hours,
               minutes,
          }
     } catch {
          return {
               day: "",
               month: "",
               thaiMonth: "",
               thaiMonthY: "",
               defYear: "",
               year: "",
               hours: "",
               minutes: "",
          }
     }
}

export function simpleDMYHM(date) {
     if (!date) return ""
     const { day, thaiMonth, year, hours, minutes } = getDateProperty(date)
     return `${day} ${thaiMonth} ${year} ${hours}:${minutes} น.`;
}
export function simpleDMY(date) {
     const { day, thaiMonth, year } = getDateProperty(date)
     return `${day} ${thaiMonth} ${year}`;
}
export function simpleDM(date) {
     const { day, thaiMonth } = getDateProperty(date)
     return `${day} ${thaiMonth}`;
}
export function simpleDmyhm(date) {
     const { day, thaiMonthY, defYear, hours, minutes } = getDateProperty(date)
     return `${day} ${thaiMonthY} ${defYear} ${hours}:${minutes}`;
}

export function timeAgo(dateString) {
     if (!dateString) return ""
     const date = new Date(dateString);
     const now = new Date();
     const secondsPast = (now.getTime() - date.getTime()) / 1000;

     if (secondsPast < 60) {
          return `1 นาทีก่อน`;
     }
     if (secondsPast < 3600) {
          return `${Math.round(secondsPast / 60)} นาทีก่อน`;
     }
     if (secondsPast <= 86400) {
          return `${Math.round(secondsPast / 3600)} ชั่วโมงก่อน`;
     }
     if (secondsPast <= 2592000) {
          return `${Math.round(secondsPast / 86400)} วันก่อน`;
     }
     if (secondsPast <= 31536000) {
          // อิงตามเดือนที่มี 30 วัน
          return `${Math.round(secondsPast / 2592000)} เดือนก่อน`;
     }
     return `${Math.round(secondsPast / 31536000)} ปีก่อน`;
}